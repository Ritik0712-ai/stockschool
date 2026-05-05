import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
  });

  if (!portfolio) {
    return NextResponse.json({ error: "No portfolio found" }, { status: 404 });
  }

  // Delete all holdings and transactions, reset cash
  await prisma.$transaction([
    prisma.holding.deleteMany({ where: { portfolioId: portfolio.id } }),
    prisma.transaction.deleteMany({ where: { portfolioId: portfolio.id } }),
    prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { virtualCash: 1000000, totalValue: 1000000 },
    }),
  ]);

  return NextResponse.json({ success: true });
}
