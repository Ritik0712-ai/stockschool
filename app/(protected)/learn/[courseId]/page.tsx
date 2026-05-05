"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronLeft, HiOutlinePlay, HiOutlineCheckCircle, HiOutlineLockClosed, HiOutlineClock } from "react-icons/hi";

type LessonInfo = {
  id: string;
  title: string;
  duration: number;
  order: number;
};

type CourseDetail = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: LessonInfo[];
};

type Progress = {
  lessonId: string;
  completed: boolean;
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, progressRes] = await Promise.all([
          fetch(`/api/courses/${params.courseId}`),
          fetch("/api/progress")
        ]);

        if (courseRes.ok && progressRes.ok) {
          setCourse(await courseRes.json());
          setProgress(await progressRes.json());
        } else if (courseRes.status === 404) {
          router.push("/learn");
        }
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.courseId) fetchData();
  }, [params.courseId, router]);

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Calculate course specific progress
  const courseLessonIds = course.lessons.map(l => l.id);
  const completedInCourse = progress.filter(p => p.completed && courseLessonIds.includes(p.lessonId)).length;
  const totalLessons = course.lessons.length;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedInCourse / totalLessons) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back navigation */}
      <Link href="/learn" className="inline-flex items-center text-sm font-medium text-white/50 hover:text-white transition-colors">
        <HiOutlineChevronLeft className="mr-1" size={16} />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="glass rounded-2xl p-8 sm:p-10 border border-white/10 relative overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium border mb-4 capitalize text-accent bg-accent/10 border-accent/20">
            {course.level} Course
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            {course.title}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed mb-8">
            {course.description}
          </p>

          {/* Progress Bar */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 max-w-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-white">Course Progress</span>
              <span className="text-accent font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <p className="text-xs text-white/40 mt-2 text-right">
              {completedInCourse} of {totalLessons} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Lessons</h2>
        
        {course.lessons.map((lesson, index) => {
          const isCompleted = progress.some(p => p.lessonId === lesson.id && p.completed);
          
          // A lesson is unlocked if it's the first one, or if the previous lesson is completed
          const previousLesson = index > 0 ? course.lessons[index - 1] : null;
          const isUnlocked = index === 0 || (previousLesson && progress.some(p => p.lessonId === previousLesson.id && p.completed));
          
          const isExpanded = expandedLesson === lesson.id;

          return (
            <motion.div 
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass rounded-xl border transition-all ${
                isExpanded ? 'border-accent/50 bg-white/[0.03]' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                disabled={!isUnlocked}
                className={`w-full flex items-center p-5 text-left ${!isUnlocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  isCompleted ? 'bg-green-500/20 text-green-400' :
                  !isUnlocked ? 'bg-white/5 text-white/30' :
                  'bg-accent/20 text-accent'
                }`}>
                  {isCompleted ? <HiOutlineCheckCircle size={22} /> :
                   !isUnlocked ? <HiOutlineLockClosed size={20} /> :
                   <HiOutlinePlay size={20} className="ml-0.5" />}
                </div>

                <div className="flex-grow pr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-semibold text-white/40 tracking-wider">LESSON {lesson.order}</span>
                  </div>
                  <h3 className={`font-medium text-lg ${isCompleted ? 'text-white/70' : 'text-white'}`}>
                    {lesson.title}
                  </h3>
                </div>

                <div className="flex-shrink-0 flex items-center text-sm text-white/40 gap-1.5">
                  <HiOutlineClock />
                  {lesson.duration} min
                </div>
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {isExpanded && isUnlocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/20">
                      <p className="text-sm text-white/60">
                        In this lesson, you will learn the fundamental concepts of {lesson.title.toLowerCase()}.
                      </p>
                      <Link 
                        href={`/learn/${course.id}/${lesson.id}`}
                        className="flex-shrink-0 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap text-center"
                      >
                        {isCompleted ? "Review Lesson" : "Start Lesson"}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
