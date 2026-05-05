import { NextResponse } from "next/server";
import { getQuote } from "@/lib/finnhub";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { symbol } = params;

  try {
    const quote = await getQuote(symbol);

    // Build a profile from quote data (Yahoo Finance includes company name)
    const profile = {
      name: quote.name,
      ticker: symbol,
      finnhubIndustry: "Equities",
      currency: quote.currency,
      exchange: quote.exchange,
    };

    return NextResponse.json({ quote, profile });
  } catch (error: unknown) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch stock data", details: errorMessage },
      { status: 500 }
    );
  }
}
