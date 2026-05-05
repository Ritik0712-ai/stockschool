import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cascade delete handles portfolio, holdings, transactions, watchlist, etc.
  await prisma.user.delete({
    where: { id: session.user.id },
  });

  return NextResponse.json({ success: true });
}
