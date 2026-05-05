"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiCheck } from "react-icons/hi";
import QuizComponent from "@/components/learn/QuizComponent";

type Lesson = {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl: string | null;
  duration: number;
  order: number;
  course: { title: string; id: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quiz: any;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const [lessonRes, progressRes] = await Promise.all([
          fetch(`/api/lessons/${params.lessonId}`),
          fetch("/api/progress")
        ]);

        if (lessonRes.ok) {
          setLesson(await lessonRes.json());
        } else {
          router.push(`/learn/${params.courseId}`);
        }

        if (progressRes.ok) {
          const progress = await progressRes.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isDone = progress.some((p: any) => p.lessonId === params.lessonId && p.completed);
          setCompleted(isDone);
        }
      } catch (error) {
        console.error("Failed to fetch lesson", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.lessonId) fetchLesson();
  }, [params.lessonId, params.courseId, router]);

  if (loading || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-12">
      
      {/* Main Content Area */}
      <div className="flex-grow lg:w-2/3 xl:w-3/4 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-sm font-medium text-white/50">
          <Link href={`/learn/${lesson.course.id}`} className="flex items-center hover:text-white transition-colors">
            <HiOutlineChevronLeft className="mr-1" />
            {lesson.course.title}
          </Link>
          <div className="flex items-center gap-2">
            {completed && (
              <span className="flex items-center text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">
                <HiCheck className="mr-1" /> Completed
              </span>
            )}
            <span>Lesson {lesson.order}</span>
          </div>
        </div>

        {/* Lesson Header */}
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            {lesson.title}
          </h1>
          <div className="flex items-center text-sm text-white/40 gap-4">
            <span>{lesson.duration} min read</span>
          </div>
        </div>

        {/* Video Player Placeholder */}
        {lesson.videoUrl && (
          <div className="aspect-video bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
               <div className="text-center">
                 <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 pl-1">
                   <HiOutlineChevronRight size={32} className="text-white" />
                 </div>
                 <p className="font-medium text-white">Video unavailable in preview</p>
               </div>
            </div>
            {/* If there was a real video, iframe goes here */}
          </div>
        )}

        {/* Markdown Content */}
        {!showQuiz ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-a:text-accent hover:prose-a:text-accent-light prose-strong:text-white prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
          >
            <ReactMarkdown>{lesson.content}</ReactMarkdown>

            <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowQuiz(true)}
                className="px-8 py-4 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
              >
                Take the Quiz
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {lesson.quiz ? (
              <QuizComponent 
                quiz={lesson.quiz} 
                lessonId={lesson.id} 
                courseId={lesson.courseId}
                onComplete={() => setCompleted(true)} 
              />
            ) : (
              <div className="glass p-8 text-center rounded-2xl">
                <p>No quiz available for this lesson.</p>
                <button
                   onClick={() => router.push(`/learn/${lesson.courseId}`)}
                   className="mt-4 px-6 py-2 bg-accent text-white rounded-lg"
                >
                  Return to Course
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Right Sidebar (Desktop only) */}
      <div className="hidden lg:block w-1/3 xl:w-1/4">
        <div className="sticky top-24 glass rounded-2xl p-6 border border-white/10">
          <h3 className="font-bold text-white mb-4">Course Content</h3>
          {/* Note: We would typically fetch all lessons for this sidebar, 
              but keeping it simple for the preview */}
          <div className="space-y-3">
             <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
               <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent">
                 {lesson.order}
               </div>
               <span className="font-medium text-sm text-white">{lesson.title}</span>
             </div>
             
             {showQuiz && (
               <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                 <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs">
                   Q
                 </div>
                 <span className="font-medium text-sm text-accent">Knowledge Check</span>
               </div>
             )}
          </div>
        </div>
      </div>

    </div>
  );
}
