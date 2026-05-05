"use client";

import { motion } from "framer-motion";
import { HiOutlineChatAlt2, HiOutlineShieldCheck, HiOutlineMap } from "react-icons/hi";

/**
 * Problem section highlighting 3 key pain points that StockSchool solves.
 * Each card has an icon, bold headline, and description.
 * Cards animate in on scroll with staggered fade-up.
 */

const painPoints = [
  {
    icon: HiOutlineChatAlt2,
    headline: "Too much jargon?",
    subtext: "We speak human.",
    description:
      "No confusing terms like P/E ratios or market cap thrown at you. We explain everything in simple Hindi & English, with real-world analogies.",
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/20",
  },
  {
    icon: HiOutlineShieldCheck,
    headline: "Afraid to lose money?",
    subtext: "Practice with ₹10L virtual cash.",
    description:
      "Our paper trading simulator lets you practice buying and selling stocks with virtual money. Zero risk, 100% learning.",
    color: "from-accent/10 to-accent/5",
    iconColor: "text-accent",
    borderColor: "border-accent/20",
  },
  {
    icon: HiOutlineMap,
    headline: "Don't know where to start?",
    subtext: "Step-by-step learning path.",
    description:
      "From 'What is a stock?' to building your first portfolio — a structured curriculum designed for Indian beginners.",
    color: "from-purple-500/10 to-purple-600/5",
    iconColor: "text-purple-500",
    borderColor: "border-purple-500/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function ProblemSection() {
  return (
    <section className="section-padding" id="problems">
      <div className="container-max">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-semibold mb-4">
            The Problem
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            Investing shouldn&apos;t feel{" "}
            <span className="text-accent">scary</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Most platforms assume you already know the basics. We don&apos;t.
          </p>
        </motion.div>

        {/* Pain point cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.headline}
              variants={cardVariants}
              className={`group relative rounded-2xl border ${point.borderColor} bg-gradient-to-br ${point.color} p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-5 shadow-sm ${point.iconColor} transition-transform duration-300 group-hover:scale-110`}
              >
                <point.icon size={28} />
              </div>

              {/* Text */}
              <h3 className="font-heading text-xl font-bold text-primary mb-1">
                {point.headline}
              </h3>
              <p className="font-heading text-lg font-semibold text-accent mb-3">
                {point.subtext}
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
