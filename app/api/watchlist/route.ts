import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: "desc" },
    });
    return NextResponse.json(watchlist);
  } catch (error: unknown) {
    console.error("Watchlist GET error:", error);
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { symbol } = await request.json();
    if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 });

    const item = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        symbol,
      },
    });

    return NextResponse.json(item);
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: "Already in watchlist" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    
    if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 });

    await prisma.watchlist.delete({
      where: {
        userId_symbol: {
          userId: session.user.id,
          symbol,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }
}
