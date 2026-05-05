import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const portfolios = await prisma.portfolio.findMany({
      orderBy: { totalValue: "desc" },
      take: limit,
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    const leaderboard = portfolios.map((p, index) => ({
      rank: index + 1,
      name: p.user.name || "Anonymous Trader",
      image: p.user.image,
      totalValue: p.totalValue,
      gain: ((p.totalValue - 1000000) / 1000000) * 100, // percentage from 10L
    }));

    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
