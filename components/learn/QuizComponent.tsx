"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

type Question = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

type Quiz = {
  id: string;
  questions: Question[];
};

type QuizComponentProps = {
  quiz: Quiz;
  lessonId: string;
  courseId: string;
  onComplete: () => void;
};

export default function QuizComponent({ quiz, lessonId, courseId, onComplete }: QuizComponentProps) {
  const router = useRouter();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsSubmitted(true);
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(idx => idx + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz finished
      setShowResults(true);
      await saveProgress();
    }
  };

  const saveProgress = async () => {
    setIsSaving(true);
    try {
      const finalScore = score + (isCorrect ? 1 : 0);
      const passed = (finalScore / quiz.questions.length) >= 0.6; // 60% to pass

      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completed: passed,
          quizScore: finalScore,
        })
      });

      if (passed) {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to save progress", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const finalScore = score;
    const passed = (finalScore / quiz.questions.length) >= 0.6;

    return (
      <div className="glass rounded-2xl p-8 border border-white/10 text-center">
        <div className="mb-6">
          {passed ? (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <HiOutlineCheckCircle size={40} />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <HiOutlineXCircle size={40} />
            </motion.div>
          )}
          
          <h3 className="text-2xl font-bold text-white mb-2">
            {passed ? "Lesson Completed!" : "Keep Trying!"}
          </h3>
          <p className="text-white/60">
            You scored {finalScore} out of {quiz.questions.length}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          {!passed ? (
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
            >
              Retry Quiz
            </button>
          ) : (
            <button
              onClick={() => router.push(`/learn/${courseId}`)}
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-xl transition-colors"
            >
              Back to Course
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10">
      <div className="flex justify-between items-center mb-6 text-sm font-medium text-white/50">
        <span>Knowledge Check</span>
        <span>Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-8">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectOption = idx === currentQuestion.correctAnswerIndex;
          
          let btnClass = "bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white";
          
          if (isSubmitted) {
            if (isCorrectOption) {
              btnClass = "bg-green-500/20 border-green-500/50 text-green-300";
            } else if (isSelected && !isCorrect) {
              btnClass = "bg-red-500/20 border-red-500/50 text-red-300";
            } else {
              btnClass = "bg-white/5 border-white/10 opacity-50";
            }
          } else if (isSelected) {
            btnClass = "bg-accent/20 border-accent/50 text-white";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border transition-all ${btnClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mb-8 p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'}`}
          >
            <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Not quite."}</p>
            <p className="opacity-90">{currentQuestion.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isSaving}
            className="px-6 py-3 bg-white text-background font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            {isSaving ? "Saving..." : currentQuestionIdx === quiz.questions.length - 1 ? "See Results" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}
