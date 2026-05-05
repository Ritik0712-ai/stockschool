"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  HiOutlineBriefcase, 
  HiOutlineTrendingUp, 
  HiOutlineSearch, 
  HiOutlineX,
  HiOutlineArrowRight
} from "react-icons/hi";
import { POPULAR_STOCKS } from "@/lib/finnhub";
import { useRouter } from "next/navigation";

export default function TradeDashboard() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<any>( // eslint-disable-line @typescript-eslint/no-explicit-any
null);
  const [watchlist, setWatchlist] = useState<any[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
[]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [portRes, watchRes] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/watchlist")
      ]);
      if (portRes.ok) setPortfolio(await portRes.json());
      if (watchRes.ok) setWatchlist(await watchRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setSearching(true);
        try {
          const res = await fetch(`/api/stocks/search?q=${searchQuery}`);
          const data = await res.json();
          setSearchResults(data.result || []);
        } catch (e) {
          console.error(e);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const removeFromWatchlist = async (symbol: string) => {
    try {
      await fetch(`/api/watchlist?symbol=${symbol}`, { method: "DELETE" });
      setWatchlist(watchlist.filter(w => w.symbol !== symbol));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);

  const initialCash = 1000000;
  const totalPL = portfolio ? portfolio.totalValue - initialCash : 0;
  const totalPLPercent = portfolio ? (totalPL / initialCash) * 100 : 0;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Paper Trading</h1>
            <p className="text-white/60">Practice investing with ₹10 Lakh virtual cash.</p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stocks (e.g. TCS.NS)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <HiOutlineSearch className="absolute left-4 top-3.5 text-white/40" size={20} />
            </div>
            
            {/* Search Results Dropdown */}
            {(searchResults.length > 0 || searching) && (
              <div className="absolute top-full mt-2 left-0 right-0 glass border border-white/10 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                {searching ? (
                  <div className="p-4 text-center text-white/50 text-sm">Searching...</div>
                ) : (
                  searchResults.slice(0, 15).map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/trade/${result.symbol}`)}
                      className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="font-semibold">{result.symbol}</p>
                        <p className="text-xs text-white/50 truncate max-w-[200px]">{result.description}</p>
                      </div>
                      <HiOutlineArrowRight className="text-white/30" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 sm:p-8 border border-white/10 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white/50 mb-1">Total Portfolio Value</p>
              <h2 className="text-4xl font-heading font-bold">{portfolio ? formatCurrency(portfolio.totalValue) : "---"}</h2>
            </div>
            <div>
              <p className="text-white/50 mb-1">Available Virtual Cash</p>
              <h3 className="text-2xl font-semibold">{portfolio ? formatCurrency(portfolio.virtualCash) : "---"}</h3>
            </div>
            <div>
              <p className="text-white/50 mb-1">All-time P&L</p>
              <div className={`text-2xl font-semibold flex items-center gap-2 ${totalPL >= 0 ? "text-accent" : "text-red-500"}`}>
                <HiOutlineTrendingUp className={totalPL >= 0 ? "" : "rotate-180"} />
                {totalPL >= 0 ? "+" : ""}{formatCurrency(totalPL)} ({totalPL >= 0 ? "+" : ""}{totalPLPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Holdings (Left, 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
              <HiOutlineBriefcase className="text-accent" /> Your Holdings
            </h3>
            
            {portfolio?.holdings?.length === 0 ? (
              <div className="glass rounded-xl p-8 border border-white/10 text-center">
                <p className="text-white/50 mb-4">You haven&apos;t bought any stocks yet.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {POPULAR_STOCKS.slice(0, 4).map(stock => (
                    <Link
                      key={stock.symbol}
                      href={`/trade/${stock.symbol}`}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                    >
                      Buy {stock.symbol.split('.')[0]}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="p-4 font-medium text-white/50 text-sm">Stock</th>
                        <th className="p-4 font-medium text-white/50 text-sm">Qty</th>
                        <th className="p-4 font-medium text-white/50 text-sm">Avg Price</th>
                        <th className="p-4 font-medium text-white/50 text-sm">Current Price</th>
                        <th className="p-4 font-medium text-white/50 text-sm">P&L</th>
                        <th className="p-4 font-medium text-white/50 text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio?.holdings?.map((h: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
                        const current = h.currentPrice || h.avgBuyPrice;
                        const pl = (current - h.avgBuyPrice) * h.quantity;
                        const plPercent = ((current - h.avgBuyPrice) / h.avgBuyPrice) * 100;
                        const isPositive = pl >= 0;

                        return (
                          <tr key={h.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                            <td className="p-4 font-semibold">{h.symbol}</td>
                            <td className="p-4">{h.quantity}</td>
                            <td className="p-4">{formatCurrency(h.avgBuyPrice)}</td>
                            <td className="p-4">{formatCurrency(current)}</td>
                            <td className={`p-4 font-medium ${isPositive ? 'text-accent' : 'text-red-500'}`}>
                              {isPositive ? '+' : ''}{formatCurrency(pl)} ({isPositive ? '+' : ''}{plPercent.toFixed(2)}%)
                            </td>
                            <td className="p-4">
                              <Link
                                href={`/trade/${h.symbol}`}
                                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                              >
                                Trade
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Watchlist (Right, 1 column) */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold">Watchlist</h3>
            
            <div className="glass rounded-xl border border-white/10 p-4">
              {watchlist.length === 0 ? (
                <p className="text-white/50 text-sm text-center py-4">Your watchlist is empty.</p>
              ) : (
                <div className="space-y-3">
                  {watchlist.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                      <Link href={`/trade/${item.symbol}`} className="flex-1 font-semibold hover:text-accent transition-colors">
                        {item.symbol}
                      </Link>
                      <button 
                        onClick={() => removeFromWatchlist(item.symbol)}
                        className="p-1.5 text-white/30 hover:text-red-400 hover:bg-white/5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        title="Remove"
                      >
                        <HiOutlineX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/trade/history" className="glass rounded-xl p-4 border border-white/10 text-center hover:bg-white/5 transition-colors">
                <p className="text-sm font-semibold">History</p>
              </Link>
              <Link href="/leaderboard" className="glass rounded-xl p-4 border border-white/10 text-center hover:bg-white/5 transition-colors">
                <p className="text-sm font-semibold text-accent">Leaderboard</p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
