import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getQuote } from "@/lib/finnhub";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { symbol, quantity, type, notes } = body;

    if (!symbol || !quantity || quantity <= 0 || type !== "BUY") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Get real-time price
    const quote = await getQuote(symbol);
    const price = quote.c;
    const totalCost = price * quantity;

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      let portfolio = await tx.portfolio.findUnique({
        where: { userId: session.user.id },
      });

      if (!portfolio) {
        throw new Error("Portfolio not found. Please visit dashboard first.");
      }

      if (portfolio.virtualCash < totalCost) {
        throw new Error("Insufficient virtual cash");
      }

      // Deduct cash
      portfolio = await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { virtualCash: { decrement: totalCost } },
      });

      // Update or create holding
      const existingHolding = await tx.holding.findUnique({
        where: {
          portfolioId_symbol: {
            portfolioId: portfolio.id,
            symbol,
          },
        },
      });

      if (existingHolding) {
        // Calculate new average buy price
        const totalOldCost = existingHolding.quantity * existingHolding.avgBuyPrice;
        const newTotalCost = totalOldCost + totalCost;
        const newQuantity = existingHolding.quantity + quantity;
        const newAvgPrice = newTotalCost / newQuantity;

        await tx.holding.update({
          where: { id: existingHolding.id },
          data: {
            quantity: newQuantity,
            avgBuyPrice: newAvgPrice,
            currentPrice: price,
          },
        });
      } else {
        await tx.holding.create({
          data: {
            portfolioId: portfolio.id,
            symbol,
            quantity,
            avgBuyPrice: price,
            currentPrice: price,
          },
        });
      }

      // Record transaction
      const transaction = await tx.transaction.create({
        data: {
          portfolioId: portfolio.id,
          symbol,
          type: "BUY",
          quantity,
          price,
          total: totalCost,
          notes,
        },
      });

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result });
  } catch (error: unknown) {
    console.error("Buy error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to execute buy order" },
      { status: 500 }
    );
  }
}
