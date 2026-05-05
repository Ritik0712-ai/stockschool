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

    if (!symbol || !quantity || quantity <= 0 || type !== "SELL") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Get real-time price
    const quote = await getQuote(symbol);
    const price = quote.c;
    const totalRevenue = price * quantity;

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      let portfolio = await tx.portfolio.findUnique({
        where: { userId: session.user.id },
      });

      if (!portfolio) {
        throw new Error("Portfolio not found.");
      }

      const existingHolding = await tx.holding.findUnique({
        where: {
          portfolioId_symbol: {
            portfolioId: portfolio.id,
            symbol,
          },
        },
      });

      if (!existingHolding || existingHolding.quantity < quantity) {
        throw new Error("Insufficient shares to sell.");
      }

      // Add cash
      portfolio = await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { virtualCash: { increment: totalRevenue } },
      });

      // Update or delete holding
      if (existingHolding.quantity === quantity) {
        // Sold all shares
        await tx.holding.delete({
          where: { id: existingHolding.id },
        });
      } else {
        await tx.holding.update({
          where: { id: existingHolding.id },
          data: {
            quantity: existingHolding.quantity - quantity,
            currentPrice: price,
          },
        });
      }

      // Record transaction
      const transaction = await tx.transaction.create({
        data: {
          portfolioId: portfolio.id,
          symbol,
          type: "SELL",
          quantity,
          price,
          total: totalRevenue,
          notes,
        },
      });

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result });
  } catch (error: unknown) {
    console.error("Sell error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to execute sell order" },
      { status: 500 }
    );
  }
}
