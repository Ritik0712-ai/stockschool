"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheck,
} from "react-icons/hi";

/**
 * 3-step onboarding wizard:
 * Step 1: Age + Investment goal
 * Step 2: Risk tolerance (card selection)
 * Step 3: Knowledge quiz (3 questions)
 *
 * Progress bar at top, Next/Back buttons, animated transitions.
 * On completion → POST /api/onboarding → redirect to /dashboard.
 */

// Quiz questions for Step 3
const quizQuestions = [
  {
    question: "What is a stock?",
    options: [
      "A type of loan",
      "Ownership in a company",
      "A government bond",
      "A savings account",
    ],
    correct: 1,
  },
  {
    question: "What does P/E ratio mean?",
    options: [
      "Price to Earnings",
      "Profit to Equity",
      "Performance to Efficiency",
      "I don't know yet",
    ],
    correct: 0,
  },
  {
    question: "What's a bull market?",
    options: [
      "Market going down",
      "Market going up",
      "Stable market",
      "No idea",
    ],
    correct: 1,
  },
];

// Risk tolerance options for Step 2
const riskOptions = [
  {
    value: "low",
    icon: "🛡️",
    title: "Conservative",
    description: "I prefer safety over high returns",
    color: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500",
  },
  {
    value: "medium",
    icon: "⚖️",
    title: "Balanced",
    description: "Balanced approach — some risk for better returns",
    color: "from-accent/10 to-accent/5",
    border: "border-accent",
  },
  {
    value: "high",
    icon: "🚀",
    title: "Aggressive",
    description: "I can handle volatility for potentially higher returns",
    color: "from-purple-500/10 to-purple-600/5",
    border: "border-purple-500",
  },
];

// Investment goal options for Step 1
const goalOptions = [
  { value: "wealth", label: "Build wealth over time" },
  { value: "retirement", label: "Save for retirement" },
  { value: "learning", label: "Just learning for now" },
];

// Step labels
const steps = [
  { label: "About You", icon: HiOutlineUser },
  { label: "Risk Profile", icon: HiOutlineShieldCheck },
  { label: "Knowledge", icon: HiOutlineAcademicCap },
];

export default function OnboardingPage() {
  const { status } = useSession({ required: true });
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1 data
  const [age, setAge] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState("");

  // Step 2 data
  const [riskTolerance, setRiskTolerance] = useState("");

  // Step 3 data
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null]);

  // Direction for animation
  const [direction, setDirection] = useState(1);

  // ---- Validation per step ----

  function isStepValid(): boolean {
    switch (currentStep) {
      case 0:
        return age !== "" && investmentGoal !== "";
      case 1:
        return riskTolerance !== "";
      case 2:
        return quizAnswers.every((a) => a !== null);
      default:
        return false;
    }
  }

  // ---- Calculate knowledge level from quiz ----

  function calculateKnowledgeLevel(): string {
    const correctCount = quizAnswers.reduce<number>((count, answer, i) => {
      return answer === quizQuestions[i].correct ? count + 1 : count;
    }, 0);

    if (correctCount === 3) return "intermediate";
    return "beginner";
  }

  // ---- Navigation ----

  function nextStep() {
    if (currentStep < 2) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }

  // ---- Submit ----

  async function handleComplete() {
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(age),
          investmentGoal,
          riskTolerance,
          knowledgeLevel: calculateKnowledgeLevel(),
        }),
      });

      if (!res.ok) {
        console.error("Onboarding save failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      console.error("Network error during onboarding");
      setLoading(false);
    }
  }

  // Loading auth session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Animation variants for step transitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl"
    >
      <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                  i <= currentStep ? "text-accent" : "text-white/30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i < currentStep
                      ? "bg-accent text-white"
                      : i === currentStep
                      ? "bg-accent/20 text-accent border border-accent"
                      : "bg-white/5 text-white/30 border border-white/10"
                  }`}
                >
                  {i < currentStep ? (
                    <HiOutlineCheck size={16} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
          {/* Progress track */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step content with animations */}
        <div className="min-h-[360px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* STEP 1: About You */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      Tell us about yourself
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      This helps us personalize your learning experience
                    </p>
                  </div>

                  {/* Age */}
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-white/60 mb-1.5">
                      Your Age
                    </label>
                    <input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      placeholder="e.g. 25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>

                  {/* Investment goal */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      What&apos;s your investment goal?
                    </label>
                    <div className="space-y-2">
                      {goalOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setInvestmentGoal(option.value)}
                          className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 border ${
                            investmentGoal === option.value
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Risk Tolerance */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      What&apos;s your risk tolerance?
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      Choose the approach that best describes you
                    </p>
                  </div>

                  <div className="space-y-3">
                    {riskOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRiskTolerance(option.value)}
                        className={`w-full px-5 py-4 rounded-xl text-left transition-all duration-200 border group ${
                          riskTolerance === option.value
                            ? `${option.border} bg-gradient-to-r ${option.color}`
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <p
                              className={`font-semibold text-sm ${
                                riskTolerance === option.value
                                  ? "text-white"
                                  : "text-white/70"
                              }`}
                            >
                              {option.title}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${
                                riskTolerance === option.value
                                  ? "text-white/60"
                                  : "text-white/30"
                              }`}
                            >
                              {option.description}
                            </p>
                          </div>
                          {riskTolerance === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                            >
                              <HiOutlineCheck className="text-white" size={14} />
                            </motion.div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Knowledge Quiz */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      Quick knowledge check
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      Don&apos;t worry — this just helps us personalize your path
                    </p>
                  </div>

                  <div className="space-y-5">
                    {quizQuestions.map((q, qi) => (
                      <div key={qi}>
                        <p className="text-sm font-medium text-white/80 mb-2">
                          {qi + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((option, oi) => (
                            <button
                              key={oi}
                              type="button"
                              onClick={() => {
                                const newAnswers = [...quizAnswers];
                                newAnswers[qi] = oi;
                                setQuizAnswers(newAnswers);
                              }}
                              className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border text-left ${
                                quizAnswers[qi] === oi
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
          {currentStep > 0 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-white/50 hover:text-white transition-colors rounded-lg"
            >
              <HiOutlineChevronLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 2 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-1 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
            >
              Next
              <HiOutlineChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!isStepValid() || loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <HiOutlineCheck size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
