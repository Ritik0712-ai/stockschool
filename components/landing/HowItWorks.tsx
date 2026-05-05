"use client";

import { motion } from "framer-motion";
import { HiOutlineBookOpen, HiOutlineChartBar, HiOutlineLightningBolt } from "react-icons/hi";

/**
 * How It Works section with 3 numbered steps connected by a dotted line.
 * - Desktop: horizontal layout with line connector
 * - Mobile: vertical stacked layout
 * Staggered entrance animation on scroll.
 */

const steps = [
  {
    number: "01",
    icon: HiOutlineBookOpen,
    title: "Learn Concepts",
    description:
      "Bite-sized lessons in Hindi & English. From stock basics to portfolio theory — no MBA needed.",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "02",
    icon: HiOutlineChartBar,
    title: "Practice Trading",
    description:
      "Use our paper trading simulator with ₹10 Lakh virtual cash. Real stock prices, zero real risk.",
    color: "from-accent to-accent-dark",
  },
  {
    number: "03",
    icon: HiOutlineLightningBolt,
    title: "Invest Confidently",
    description:
      "Apply what you learned to the real market. Track your portfolio and grow wealth systematically.",
    color: "from-purple-500 to-purple-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  return (
    <section className="section-padding" id="how-it-works">
      <div className="container-max">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            Three steps to{" "}
            <span className="text-accent">financial confidence</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            We&apos;ve designed a clear learning path that takes you from zero to confident investor.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {/* Horizontal connector line (desktop only) */}
          <div className="hidden md:block absolute top-[72px] left-[16%] right-[16%] h-[2px]">
            <div className="w-full h-full border-t-2 border-dashed border-gray-200" />
          </div>

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Number + Icon container */}
              <div className="relative mb-6">
                {/* Background circle */}
                <div className="w-36 h-36 rounded-full glass shadow-lg shadow-black/10 flex items-center justify-center transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-accent/10">
                  {/* Gradient inner circle */}
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <step.icon size={36} className="text-white" />
                  </div>
                </div>

                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-white font-heading font-bold text-sm flex items-center justify-center shadow-md">
                  {step.number}
                </div>
              </div>

              {/* Text */}
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
