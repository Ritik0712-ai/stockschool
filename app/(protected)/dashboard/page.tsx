"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineLightningBolt,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

interface DashboardData {
  lessonsCompleted: number;
  portfolioValue: string;
  totalTrades: number;
  winRate: number;
}

function SkeletonBlock({ w, h }: { w: string; h: string }) {
  return (
    <div className={`${w} ${h} rounded bg-white/10 animate-pulse`} />
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "Investor";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    async function loadStats() {
      try {
        const [progressRes, analyticsRes] = await Promise.all([
          fetch("/api/progress").catch(() => null),
          fetch("/api/portfolio/analytics").catch(() => null),
        ]);

        let lessonsCompleted = 0;
        if (progressRes?.ok) {
          const progressData = await progressRes.json();
          lessonsCompleted = Array.isArray(progressData)
            ? progressData.filter((p: { completed: boolean }) => p.completed).length
            : 0;
        }

        let portfolioValue = "₹10,00,000";
        let totalTrades = 0;
        let winRate = 0;
        if (analyticsRes?.ok) {
          const analytics = await analyticsRes.json();
          portfolioValue = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(analytics.totalValue || 1000000);
          totalTrades = analytics.totalTrades || 0;
          winRate = analytics.winRate || 0;
        }

        setStats({ lessonsCompleted, portfolioValue, totalTrades, winRate });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const quickActions = [
    {
      title: "Start Learning",
      description: "Begin with stock market fundamentals",
      icon: HiOutlineAcademicCap,
      href: "/learn",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Paper Trading",
      description: "Practice with ₹10 Lakh virtual cash",
      icon: HiOutlineChartBar,
      href: "/trade",
      color: "from-accent to-accent-dark",
    },
    {
      title: "Analytics",
      description: "Track performance & insights",
      icon: HiOutlineChartPie,
      href: "/portfolio",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Quick Quiz",
      description: "Test your knowledge & earn XP",
      icon: HiOutlineLightningBolt,
      href: "/learn",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Settings",
      description: "Manage profile & preferences",
      icon: HiOutlineCog,
      href: "/settings",
      color: "from-slate-400 to-slate-500",
    },
    {
      title: "Help Center",
      description: "FAQs and support",
      icon: HiOutlineQuestionMarkCircle,
      href: "/help",
      color: "from-cyan-400 to-cyan-500",
    },
  ];

  const statCards = loading
    ? null
    : [
        { label: "Lessons Completed", value: String(stats?.lessonsCompleted ?? 0) },
        { label: "Portfolio Value", value: stats?.portfolioValue ?? "₹10,00,000" },
        { label: "Total Trades", value: String(stats?.totalTrades ?? 0) },
        { label: "Win Rate", value: `${stats?.winRate ?? 0}%` },
      ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Let&apos;s continue building your investment knowledge
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-12">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 border border-white/10">
                  <SkeletonBlock w="w-20" h="h-7" />
                  <SkeletonBlock w="w-28" h="h-4" />
                </div>
              ))
            : statCards?.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-xl p-4 border border-white/10"
                >
                  <p className="text-2xl font-heading font-bold">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                </motion.div>
              ))}
        </div>

        {/* Quick actions grid */}
        <h2 className="font-heading text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
            >
              <Link
                href={action.href}
                className="group glass rounded-xl p-5 border border-white/10 hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-300 block"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}
                >
                  <action.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">
                  {action.title}
                </h3>
                <p className="text-white/40 text-xs mt-1">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
