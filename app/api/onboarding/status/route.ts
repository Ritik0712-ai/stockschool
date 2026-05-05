import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * GET /api/onboarding/status
 * Returns the user's onboarding completion status.
 * Used by the login page to determine redirect destination.
 */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { onboardingDone: true },
    });

    return NextResponse.json({
      onboardingDone: profile?.onboardingDone ?? false,
    });
  } catch (error) {
    console.error("Onboarding status error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
