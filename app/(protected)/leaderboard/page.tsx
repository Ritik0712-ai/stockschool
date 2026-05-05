"use client";

import { useEffect, useState } from "react";
import { HiOutlineStar } from "react-icons/hi";
import Image from "next/image";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(data => {
        setLeaders(data);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
            <HiOutlineStar size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Global Leaderboard</h1>
          <p className="text-white/60">See how your paper trading portfolio stacks up against others.</p>
        </div>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 sm:p-6 font-medium text-white/50 w-24">Rank</th>
                <th className="p-4 sm:p-6 font-medium text-white/50">Trader</th>
                <th className="p-4 sm:p-6 font-medium text-white/50 text-right">Portfolio Value</th>
                <th className="p-4 sm:p-6 font-medium text-white/50 text-right">Total Gain</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader) => {
                const isPositive = leader.gain >= 0;
                
                return (
                  <tr key={leader.rank} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="p-4 sm:p-6 font-heading font-bold text-xl">
                      #{leader.rank}
                    </td>
                    <td className="p-4 sm:p-6">
                      <div className="flex items-center gap-3">
                        {leader.image ? (
                          <Image 
                            src={leader.image} 
                            alt={leader.name} 
                            width={40} 
                            height={40} 
                            className="rounded-full bg-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 font-bold uppercase">
                            {leader.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-white/90">{leader.name}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-6 text-right font-bold text-lg">
                      {formatCurrency(leader.totalValue)}
                    </td>
                    <td className={`p-4 sm:p-6 text-right font-bold ${isPositive ? 'text-accent' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{leader.gain.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
