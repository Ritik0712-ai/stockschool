import { NextResponse } from "next/server";
import { searchStocks } from "@/lib/finnhub";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ result: [] });
  }

  // Search is fully local (2,338 NSE stocks), no API call needed
  const data = await searchStocks(q);
  return NextResponse.json(data);
}
