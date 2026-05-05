"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";

/**
 * Hero section with:
 * - Bold headline + subheadline
 * - CTA button linking to /signup
 * - Animated SVG stock chart with Framer Motion path drawing
 * - Dot pattern background with gradient overlay
 */

// SVG chart data points for the animated stock chart
const chartPath = "M 0 180 Q 40 170 60 140 Q 80 110 100 120 Q 140 140 160 90 Q 180 40 220 60 Q 260 80 280 30 Q 300 10 340 50 Q 360 65 380 20 Q 400 5 420 40";

// Data points for floating dots on the chart
const dataPoints = [
  { x: 60, y: 140, delay: 0.3 },
  { x: 160, y: 90, delay: 0.5 },
  { x: 280, y: 30, delay: 0.7 },
  { x: 380, y: 20, delay: 0.9 },
  { x: 420, y: 40, delay: 1.1 },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient"
      id="hero"
    >
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      {/* Radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container-max relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Free for Indian investors
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
              Learn Investing.{" "}
              <span className="gradient-text">Without Losing Money.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Master stocks through jargon-free lessons + risk-free paper
              trading. Built for Indians who want to grow wealth, not gamble it.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button href="/signup" size="lg" id="hero-cta">
                Start Learning Free
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
              <Button href="#how-it-works" variant="outline" size="lg">
                See How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-white/40"
            >
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                100% free to start
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Animated Stock Chart */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow behind chart */}
              <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-3xl scale-110" />

              {/* Chart container */}
              <div className="relative glass rounded-3xl p-6 sm:p-8">
                {/* Chart header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                      Portfolio Value
                    </p>
                    <p className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
                      ₹10,47,230
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/15 text-accent text-sm font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17l5-5 5 5M7 7l5 5 5-5" />
                    </svg>
                    +12.4%
                  </div>
                </div>

                {/* Animated SVG Chart */}
                <svg
                  viewBox="0 0 440 200"
                  className="w-full h-auto"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  {[0, 50, 100, 150].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="440"
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Gradient fill under the chart line */}
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#10B981"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Fill area */}
                  <motion.path
                    d={`${chartPath} L 420 200 L 0 200 Z`}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                  />

                  {/* Animated chart line */}
                  <motion.path
                    d={chartPath}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                  />

                  {/* Animated data points */}
                  {dataPoints.map((point, i) => (
                    <motion.g key={i}>
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="#10B981"
                        fillOpacity="0.2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: point.delay + 1.2 }}
                      />
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="3"
                        fill="#10B981"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: point.delay + 1.2 }}
                      />
                    </motion.g>
                  ))}
                </svg>

                {/* Mini stats row */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
                  {[
                    { label: "Invested", value: "₹8,00,000" },
                    { label: "Returns", value: "₹2,47,230" },
                    { label: "CAGR", value: "15.2%" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2 + i * 0.15 }}
                      className="text-center"
                    >
                      <p className="text-white/30 text-xs">{stat.label}</p>
                      <p className="text-white font-semibold text-sm mt-1">
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
