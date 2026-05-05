import { NextResponse } from "next/server";
import { getStockCandles } from "@/lib/finnhub";
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
  const { searchParams } = new URL(request.url);
  
  // Default to 1D resolution, last 30 days
  const resolution = searchParams.get("resolution") || "D";
  const to = Math.floor(Date.now() / 1000);
  const from = to - (30 * 24 * 60 * 60); // 30 days ago

  try {
    const data = await getStockCandles(symbol, resolution, from, to);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Chart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
