import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * POST /api/onboarding
 * Saves the user's onboarding profile data.
 * Requires authentication.
 *
 * Body: { age?: number, riskTolerance?: string, investmentGoal?: string, knowledgeLevel?: string }
 * Returns: { success: true, profile: Profile }
 */

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { age, riskTolerance, investmentGoal, knowledgeLevel } = body;

    // ---- Validation ----

    if (age !== undefined && (age < 18 || age > 100)) {
      return NextResponse.json(
        { error: "Age must be between 18 and 100" },
        { status: 400 }
      );
    }

    const validRiskTolerances = ["low", "medium", "high"];
    if (riskTolerance && !validRiskTolerances.includes(riskTolerance)) {
      return NextResponse.json(
        { error: "Invalid risk tolerance value" },
        { status: 400 }
      );
    }

    const validGoals = ["wealth", "retirement", "learning"];
    if (investmentGoal && !validGoals.includes(investmentGoal)) {
      return NextResponse.json(
        { error: "Invalid investment goal" },
        { status: 400 }
      );
    }

    const validLevels = ["beginner", "intermediate", "advanced"];
    if (knowledgeLevel && !validLevels.includes(knowledgeLevel)) {
      return NextResponse.json(
        { error: "Invalid knowledge level" },
        { status: 400 }
      );
    }

    // ---- Upsert profile ----

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        age: age ?? undefined,
        riskTolerance: riskTolerance ?? undefined,
        investmentGoal: investmentGoal ?? undefined,
        knowledgeLevel: knowledgeLevel ?? undefined,
        onboardingDone: true,
      },
      create: {
        userId: session.user.id,
        age,
        riskTolerance,
        investmentGoal,
        knowledgeLevel,
        onboardingDone: true,
      },
    });

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
