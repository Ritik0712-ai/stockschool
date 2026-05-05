import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
    include: {
      holdings: true,
      transactions: { orderBy: { timestamp: "desc" } },
    },
  });

  if (!portfolio) {
    return NextResponse.json({
      totalTrades: 0,
      winRate: 0,
      biggestWin: null,
      biggestLoss: null,
      mostTraded: null,
      avgHoldingPeriod: 0,
      allocation: [],
      cashVsInvested: { cash: 100, invested: 0 },
      behavioralTips: ["Start trading to unlock insights!"],
      monthlyPnL: [],
    });
  }

  const txns = portfolio.transactions;
  const holdings = portfolio.holdings;
  const totalTrades = txns.length;

  // ─── Win Rate ─────────────────────────────────────────────────────
  // Group SELL transactions: if sell price > avg buy price for that stock, it's a win
  const sellTxns = txns.filter((t) => t.type === "SELL");
  const buyTxns = txns.filter((t) => t.type === "BUY");

  // Calculate avg buy price per symbol from buy transactions
  const buyAvgMap: Record<string, { totalCost: number; totalQty: number }> = {};
  for (const b of buyTxns) {
    if (!buyAvgMap[b.symbol]) buyAvgMap[b.symbol] = { totalCost: 0, totalQty: 0 };
    buyAvgMap[b.symbol].totalCost += b.total;
    buyAvgMap[b.symbol].totalQty += b.quantity;
  }

  let wins = 0;
  let biggestWinVal = 0;
  let biggestLossVal = 0;
  let biggestWin: { symbol: string; pnl: number } | null = null;
  let biggestLoss: { symbol: string; pnl: number } | null = null;

  for (const s of sellTxns) {
    const avg = buyAvgMap[s.symbol];
    if (!avg) continue;
    const avgPrice = avg.totalCost / avg.totalQty;
    const pnl = (s.price - avgPrice) * s.quantity;
    if (pnl > 0) wins++;
    if (pnl > biggestWinVal) {
      biggestWinVal = pnl;
      biggestWin = { symbol: s.symbol, pnl: Math.round(pnl * 100) / 100 };
    }
    if (pnl < biggestLossVal) {
      biggestLossVal = pnl;
      biggestLoss = { symbol: s.symbol, pnl: Math.round(pnl * 100) / 100 };
    }
  }

  const winRate = sellTxns.length > 0 ? Math.round((wins / sellTxns.length) * 100) : 0;

  // ─── Most Traded ──────────────────────────────────────────────────
  const symbolCount: Record<string, number> = {};
  for (const t of txns) {
    symbolCount[t.symbol] = (symbolCount[t.symbol] || 0) + 1;
  }
  const mostTraded = Object.entries(symbolCount).sort((a, b) => b[1] - a[1])[0];

  // ─── Average Holding Period ───────────────────────────────────────
  // For each symbol, find first BUY and last SELL, compute days
  const holdingDays: number[] = [];
  const symbolBuyDates: Record<string, Date> = {};
  for (const t of [...txns].reverse()) {
    if (t.type === "BUY" && !symbolBuyDates[t.symbol]) {
      symbolBuyDates[t.symbol] = t.timestamp;
    }
  }
  for (const s of sellTxns) {
    const buyDate = symbolBuyDates[s.symbol];
    if (buyDate) {
      const days = Math.ceil(
        (s.timestamp.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      holdingDays.push(Math.max(days, 0));
    }
  }
  const avgHoldingPeriod =
    holdingDays.length > 0
      ? Math.round(holdingDays.reduce((a, b) => a + b, 0) / holdingDays.length)
      : 0;

  // ─── Allocation ───────────────────────────────────────────────────
  const investedValue = holdings.reduce(
    (sum, h) => sum + h.avgBuyPrice * h.quantity,
    0
  );
  const totalValue = portfolio.virtualCash + investedValue;

  const allocation = holdings.map((h) => ({
    symbol: h.symbol,
    value: Math.round(h.avgBuyPrice * h.quantity * 100) / 100,
    percent:
      totalValue > 0
        ? Math.round(((h.avgBuyPrice * h.quantity) / totalValue) * 10000) / 100
        : 0,
    quantity: h.quantity,
  }));

  const cashPercent =
    totalValue > 0 ? Math.round((portfolio.virtualCash / totalValue) * 10000) / 100 : 100;
  const investedPercent = Math.round((100 - cashPercent) * 100) / 100;

  // ─── Monthly P&L ─────────────────────────────────────────────────
  const monthlyMap: Record<string, number> = {};
  for (const t of txns) {
    const key = `${t.timestamp.getFullYear()}-${String(t.timestamp.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[key]) monthlyMap[key] = 0;
    if (t.type === "SELL") {
      const avg = buyAvgMap[t.symbol];
      if (avg) {
        const avgPrice = avg.totalCost / avg.totalQty;
        monthlyMap[key] += (t.price - avgPrice) * t.quantity;
      }
    }
  }
  const monthlyPnL = Object.entries(monthlyMap)
    .sort()
    .map(([month, pnl]) => ({
      month,
      pnl: Math.round(pnl * 100) / 100,
    }));

  // ─── Behavioral Tips ──────────────────────────────────────────────
  const tips: string[] = [];
  if (holdings.length >= 5) {
    tips.push("✅ Great diversification! You hold 5+ different stocks.");
  } else if (holdings.length > 0 && holdings.length < 3) {
    tips.push("⚠️ Consider diversifying — you only hold " + holdings.length + " stock(s).");
  }
  if (avgHoldingPeriod > 0 && avgHoldingPeriod < 7 && winRate > 50) {
    tips.push("⚡ You tend to sell winners quickly. Consider holding longer for bigger gains.");
  }
  if (avgHoldingPeriod > 30) {
    tips.push("🕐 You're a patient investor — your average hold is " + avgHoldingPeriod + " days.");
  }
  if (winRate >= 60) {
    tips.push("🎯 Your win rate of " + winRate + "% is excellent!");
  }
  if (totalTrades === 0) {
    tips.push("🚀 Make your first trade to start tracking performance!");
  }
  if (tips.length === 0) {
    tips.push("📊 Keep trading to unlock more personalized insights.");
  }

  return NextResponse.json({
    totalTrades,
    winRate,
    biggestWin,
    biggestLoss,
    mostTraded: mostTraded ? { symbol: mostTraded[0], count: mostTraded[1] } : null,
    avgHoldingPeriod,
    allocation,
    cashVsInvested: { cash: cashPercent, invested: investedPercent },
    behavioralTips: tips,
    monthlyPnL,
    virtualCash: portfolio.virtualCash,
    totalValue,
  });
}
