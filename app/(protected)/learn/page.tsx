"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineBookOpen, HiOutlineLockClosed } from "react-icons/hi";

type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  order: number;
  _count: { lessons: number };
};

type Progress = {
  lessonId: string;
  completed: boolean;
};

export default function LearnDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, progressRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/progress")
        ]);

        if (coursesRes.ok && progressRes.ok) {
          setCourses(await coursesRes.json());
          setProgress(await progressRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch learning data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Calculate global progress
  const totalCompleted = progress.filter(p => p.completed).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-white mb-2">
          Your Learning Path
        </h1>
        <p className="text-white/60">
          Master the stock market step-by-step. Start from the basics and build your way up to advanced strategies.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="glass rounded-2xl p-6 border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Overall Progress</h2>
          <p className="text-sm text-white/50 mt-1">Lessons completed: {totalCompleted}</p>
        </div>
        <div className="flex items-center gap-2 text-accent bg-accent/10 px-4 py-2 rounded-xl font-medium">
          <HiOutlineBookOpen size={20} />
          {totalCompleted} / {courses.reduce((acc, c) => acc + c._count.lessons, 0)} completed
        </div>
      </div>

      {/* Course Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => {
          // Simple logic: Course is locked if it's not the first course and 
          // the user hasn't completed any lessons (this is a simplified logic for Phase 3)
          const isLocked = index > 0 && totalCompleted === 0;

          const levelColors = {
            beginner: "text-green-400 bg-green-400/10 border-green-400/20",
            intermediate: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            advanced: "text-purple-400 bg-purple-400/10 border-purple-400/20",
          };

          const levelColor = levelColors[course.level as keyof typeof levelColors] || "text-white bg-white/10";

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass rounded-2xl p-6 border border-white/10 flex flex-col h-full relative overflow-hidden ${
                isLocked ? "opacity-60 grayscale-[50%]" : "hover:border-white/20 transition-colors"
              }`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-background/80 rounded-full p-3 border border-white/10">
                    <HiOutlineLockClosed className="text-white/60" size={24} />
                  </div>
                </div>
              )}

              <div className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-medium border mb-4 capitalize ${levelColor}`}>
                {course.level}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-white/60 mb-6 flex-grow">{course.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <span className="text-sm text-white/40 flex items-center gap-1.5">
                  <HiOutlineBookOpen /> {course._count.lessons} lessons
                </span>
                
                <Link
                  href={isLocked ? "#" : `/learn/${course.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLocked 
                      ? "bg-white/5 text-white/30 cursor-not-allowed" 
                      : "bg-accent hover:bg-accent-dark text-white"
                  }`}
                  tabIndex={isLocked ? -1 : 0}
                >
                  {totalCompleted > 0 ? "Continue" : "Start"}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
