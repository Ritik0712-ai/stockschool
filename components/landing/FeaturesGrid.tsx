"use client";

import { motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineCurrencyRupee,
  HiOutlineChartSquareBar,
  HiOutlineCollection,
  HiOutlineFire,
  HiOutlineUserGroup,
} from "react-icons/hi";

/**
 * Features grid showing 6 key platform features in a 2×3 responsive grid.
 * Each card has an icon, title, and description with hover glow effect.
 * Staggered entrance animation on scroll.
 */

const features = [
  {
    icon: HiOutlineAcademicCap,
    title: "Jargon-Free Lessons",
    description:
      "Learn investing concepts in plain Hindi & English with real-world examples. No finance degree needed.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: HiOutlineCurrencyRupee,
    title: "Paper Trading Simulator",
    description:
      "Practice buying and selling real stocks with ₹10 Lakh virtual cash. Build confidence before investing real money.",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: HiOutlineChartSquareBar,
    title: "Real-Time Stock Data",
    description:
      "Live NSE & BSE data with interactive charts. Track Nifty 50, Sensex, and individual stocks in real-time.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: HiOutlineCollection,
    title: "Portfolio Tracking",
    description:
      "Monitor your virtual and real investments in one place. See returns, allocation, and performance over time.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    icon: HiOutlineFire,
    title: "Leaderboard & Gamification",
    description:
      "Earn XP, badges, and climb the leaderboard as you learn. Compete with friends and stay motivated.",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Community Support",
    description:
      "Join a community of 1,000+ Indian learners. Ask questions, share insights, and grow together.",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function FeaturesGrid() {
  return (
    <section className="section-padding" id="features">
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
            Features
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            Everything you need to{" "}
            <span className="text-accent">invest smarter</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            A complete toolkit designed for the Indian investor — from learning
            to earning.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="card-glow group"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon size={24} />
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg font-bold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
