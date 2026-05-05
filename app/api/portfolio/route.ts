import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getQuote } from "@/lib/finnhub";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      include: { holdings: true },
    });

    // Auto-create portfolio with 10 Lakh virtual cash
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: session.user.id,
          virtualCash: 1000000,
          totalValue: 1000000,
        },
        include: { holdings: true },
      });
    }

    // Try to update current prices for holdings
    // Be careful with Finnhub rate limits (60/min)
    if (portfolio.holdings.length > 0) {
      let updatedTotalValue = portfolio.virtualCash;
      
      await Promise.all(
        portfolio.holdings.map(async (holding) => {
          try {
            const quote = await getQuote(holding.symbol);
            const currentPrice = quote.c;
            
            updatedTotalValue += currentPrice * holding.quantity;

            // Update in DB
            return await prisma.holding.update({
              where: { id: holding.id },
              data: { currentPrice },
            });
          } catch {
            // Fallback to last known price if API fails
            updatedTotalValue += (holding.currentPrice || holding.avgBuyPrice) * holding.quantity;
            return holding;
          }
        })
      );

      // Update total portfolio value
      portfolio = await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: { totalValue: updatedTotalValue },
        include: { holdings: true }, // get fresh data
      });
    }

    return NextResponse.json(portfolio);
  } catch (error: unknown) {
    console.error("Portfolio error:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio" },
      { status: 500 }
    );
  }
}
