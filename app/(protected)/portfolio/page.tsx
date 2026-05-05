"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiOutlineChartPie,
  HiOutlineTrendingUp,
  HiOutlineLightningBolt,
  HiOutlineCash,
  HiOutlineScale,
  HiOutlineClock,
} from "react-icons/hi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#06B6D4",
];

interface AnalyticsData {
  totalTrades: number;
  winRate: number;
  biggestWin: { symbol: string; pnl: number } | null;
  biggestLoss: { symbol: string; pnl: number } | null;
  mostTraded: { symbol: string; count: number } | null;
  avgHoldingPeriod: number;
  allocation: { symbol: string; value: number; percent: number; quantity: number }[];
  cashVsInvested: { cash: number; invested: number };
  behavioralTips: string[];
  monthlyPnL: { month: string; pnl: number }[];
  virtualCash: number;
  totalValue: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-accent",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className={color} size={20} />
        </div>
        <p className="text-white/50 text-sm">{label}</p>
      </div>
      <p className="text-2xl font-heading font-bold">{value}</p>
      {sub && <p className="text-white/40 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

// Skeleton loader for analytics
function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-5 border border-white/10 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-white/10" />
        <div className="w-24 h-4 rounded bg-white/10" />
      </div>
      <div className="w-16 h-7 rounded bg-white/10" />
    </div>
  );
}

export default function PortfolioAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="w-64 h-8 rounded bg-white/10 animate-pulse mb-2" />
            <div className="w-96 h-5 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <p className="text-white/50">Could not load analytics.</p>
      </div>
    );
  }

  const allocationWithCash = [
    ...data.allocation,
    {
      symbol: "Cash",
      value: data.virtualCash,
      percent: data.cashVsInvested.cash,
      quantity: 0,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
            Portfolio Analytics
          </h1>
          <p className="text-white/50">
            Track your performance, allocation, and trading behavior.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={HiOutlineTrendingUp}
            label="Total Trades"
            value={data.totalTrades}
            sub={data.mostTraded ? `Most traded: ${data.mostTraded.symbol}` : undefined}
          />
          <StatCard
            icon={HiOutlineScale}
            label="Win Rate"
            value={`${data.winRate}%`}
            sub={
              data.biggestWin
                ? `Best: +${fmt(data.biggestWin.pnl)} (${data.biggestWin.symbol})`
                : undefined
            }
            color={data.winRate >= 50 ? "text-accent" : "text-red-400"}
          />
          <StatCard
            icon={HiOutlineClock}
            label="Avg Hold Period"
            value={`${data.avgHoldingPeriod} days`}
          />
          <StatCard
            icon={HiOutlineCash}
            label="Portfolio Value"
            value={fmt(data.totalValue)}
            sub={`Cash: ${fmt(data.virtualCash)}`}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Allocation Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
              <HiOutlineChartPie className="text-accent" />
              Portfolio Allocation
            </h3>
            {allocationWithCash.length > 1 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-1/2" style={{ height: 250 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={allocationWithCash}
                        dataKey="value"
                        nameKey="symbol"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={55}
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {allocationWithCash.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={COLORS[idx % COLORS.length]}
                            opacity={0.9}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(15,23,42,0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 12,
                          color: "#fff",
                        }}
                        formatter={(value) => [fmt(Number(value)), "Value"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  {allocationWithCash.map((item, idx) => (
                    <div
                      key={item.symbol}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-white/80">{item.symbol}</span>
                      </div>
                      <span className="text-white/50">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/40">
                <p>Buy stocks to see allocation breakdown</p>
              </div>
            )}
          </motion.div>

          {/* Monthly P&L Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
              <HiOutlineTrendingUp className="text-accent" />
              Monthly P&L
            </h3>
            {data.monthlyPnL.length > 0 ? (
              <div style={{ height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={data.monthlyPnL}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15,23,42,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                      formatter={(value) => [fmt(Number(value)), "P&L"]}
                    />
                    <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                      {data.monthlyPnL.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/40">
                <p>Complete sell trades to see monthly P&L</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Behavioral Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-8"
        >
          <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
            <HiOutlineLightningBolt className="text-yellow-400" />
            Trading Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.behavioralTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white/70"
              >
                {tip}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/trade"
            className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:bg-accent-light transition-colors"
          >
            Go to Trading
          </Link>
          <Link
            href="/trade/history"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Trade History
          </Link>
          <Link
            href="/leaderboard"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
