import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET all progress for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to update progress (mark complete, save quiz score)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, completed, quizScore } = body;

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    // Upsert progress (create or update)
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        }
      },
      update: {
        completed: completed !== undefined ? completed : true,
        quizScore: quizScore !== undefined ? quizScore : null,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed: completed !== undefined ? completed : true,
        quizScore: quizScore !== undefined ? quizScore : null,
        completedAt: completed ? new Date() : null,
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
