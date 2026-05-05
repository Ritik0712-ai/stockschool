"use client";

import { useEffect, useState } from "react";
import { HiOutlineStar, HiStar, HiOutlineArrowLeft } from "react-icons/hi";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";
import { toast } from "sonner";

export default function TradeSymbolPage({ params }: { params: { symbol: string } }) {
    const [data, setData] = useState<any>( // eslint-disable-line @typescript-eslint/no-explicit-any
null);
  const [chartData, setChartData] = useState<any[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
[]);
  const [portfolio, setPortfolio] = useState<any>( // eslint-disable-line @typescript-eslint/no-explicit-any
null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Trade form state
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSymbolData = async () => {
    try {
      const [stockRes, chartRes, portRes, watchRes] = await Promise.all([
        fetch(`/api/stocks/${params.symbol}`),
        fetch(`/api/stocks/${params.symbol}/chart`),
        fetch("/api/portfolio"),
        fetch("/api/watchlist")
      ]);

      if (stockRes.ok) setData(await stockRes.json());
      if (portRes.ok) setPortfolio(await portRes.json());
      
      if (watchRes.ok) {
        const watch = await watchRes.json();
        setIsWatchlisted(watch.some((w: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => w.symbol === params.symbol));
      }

      if (chartRes.ok) {
        const chart = await chartRes.json();
        if (chart.s === "ok") {
          const formatted = chart.t.map((time: number, index: number) => ({
            date: new Date(time * 1000).toLocaleDateString(),
            price: chart.c[index]
          }));
          setChartData(formatted);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymbolData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.symbol]);

  const toggleWatchlist = async () => {
    try {
      if (isWatchlisted) {
        await fetch(`/api/watchlist?symbol=${params.symbol}`, { method: "DELETE" });
        setIsWatchlisted(false);
      } else {
        await fetch("/api/watchlist", {
          method: "POST",
          body: JSON.stringify({ symbol: params.symbol }),
          headers: { "Content-Type": "application/json" }
        });
        setIsWatchlisted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/trade/${action.toLowerCase()}`, {
        method: "POST",
        body: JSON.stringify({
          symbol: params.symbol,
          quantity: Number(quantity),
          type: action,
          notes
        }),
        headers: { "Content-Type": "application/json" }
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Trade failed");
      }

      const msg = `Successfully ${action === "BUY" ? "bought" : "sold"} ${quantity} shares of ${params.symbol}!`;
      setSuccess(msg);
      toast.success(msg);
      setQuantity("");
      setNotes("");
      fetchSymbolData(); // refresh portfolio and prices
    } catch (err: unknown) {
      const errMsg = (err as Error).message || "Trade failed";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data?.quote) {
    return (
      <div className="min-h-screen pt-24 pb-12 text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold mb-2">Could not load stock data</h2>
        <p className="text-white/50 max-w-md">This is usually temporary. Yahoo Finance may be rate-limiting requests. Wait a moment and try again.</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => { setLoading(true); fetchSymbolData(); }}
            className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:bg-accent-light transition-colors"
          >
            Try Again
          </button>
          <Link href="/trade" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = data.quote.c;
  const change = data.quote.d;
  const changePercent = data.quote.dp;
  const isPositive = change >= 0;

  const currentHolding = portfolio?.holdings?.find((h: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => h.symbol === params.symbol);
  const qtyOwned = currentHolding?.quantity || 0;
  const totalCost = Number(quantity) > 0 ? Number(quantity) * currentPrice : 0;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        
        <Link href="/trade" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
          <HiOutlineArrowLeft /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Info & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 border border-white/10 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-heading font-bold">{data.profile?.name || params.symbol}</h1>
                <p className="text-white/50 text-lg mb-4">{params.symbol} • {data.profile?.finnhubIndustry || "Equities"}</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold">₹{currentPrice.toFixed(2)}</span>
                  <span className={`text-xl font-medium mb-1 ${isPositive ? 'text-accent' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <button 
                onClick={toggleWatchlist}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {isWatchlisted ? <HiStar className="text-yellow-400" size={24} /> : <HiOutlineStar className="text-white/50" size={24} />}
              </button>
            </div>

            {/* Chart */}
            <div className="glass rounded-2xl p-6 border border-white/10 h-[400px]">
              <h3 className="font-semibold mb-4 text-white/80">30-Day History</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A2540', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="price" stroke={isPositive ? "#10B981" : "#EF4444"} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/30">No chart data available.</div>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-sm">Open</p>
                <p className="font-semibold">₹{data.quote.o.toFixed(2)}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-sm">High</p>
                <p className="font-semibold">₹{data.quote.h.toFixed(2)}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-sm">Low</p>
                <p className="font-semibold">₹{data.quote.l.toFixed(2)}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-sm">Prev Close</p>
                <p className="font-semibold">₹{data.quote.pc.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Trade Panel */}
          <div>
            <div className="glass rounded-2xl p-6 border border-white/10 sticky top-24">
              <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                <button 
                  onClick={() => setAction("BUY")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${action === "BUY" ? "bg-accent text-background" : "hover:bg-white/5"}`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setAction("SELL")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${action === "SELL" ? "bg-red-500 text-white" : "hover:bg-white/5"}`}
                >
                  Sell
                </button>
              </div>

              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-white/50">Shares Owned:</span>
                <span className="font-semibold">{qtyOwned}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-white/50">Available Cash:</span>
                <span className="font-semibold">₹{portfolio?.virtualCash?.toFixed(2) || "0.00"}</span>
              </div>

              {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {success && <div className="p-3 mb-4 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm">{success}</div>}

              <form onSubmit={handleTrade} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent/50"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/50 mb-1">Trade Notes (Optional)</label>
                  <input 
                    type="text" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent/50"
                    placeholder="Why are you making this trade?"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white/80">Estimated Total</span>
                    <span className="text-xl font-bold">₹{totalCost.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={submitting || !quantity}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      submitting || !quantity ? "opacity-50 cursor-not-allowed" : ""
                    } ${action === "BUY" ? "bg-accent hover:bg-accent-light text-background" : "bg-red-500 hover:bg-red-400 text-white"}`}
                  >
                    {submitting ? "Processing..." : `Confirm ${action}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
