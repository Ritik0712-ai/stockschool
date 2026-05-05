/**
 * Stock Data Library
 * Uses Yahoo Finance API for Indian NSE stocks.
 * Features:
 *  - In-memory cache (60s TTL) to avoid hitting rate limits
 *  - Automatic retry with backoff on 429 (Too Many Requests)
 *  - Full 2,338-stock NSE search database (local, no API needed)
 */

const YAHOO_ENDPOINTS = [
  "https://query1.finance.yahoo.com/v8/finance/chart",
  "https://query2.finance.yahoo.com/v8/finance/chart",
];

const YAHOO_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json",
};

// ─── In-memory cache ────────────────────────────────────────────────
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const quoteCache = new Map<string, CacheEntry<QuoteData>>();
const candleCache = new Map<string, CacheEntry<CandleData>>();

const QUOTE_CACHE_TTL = 60_000;   // 60 seconds
const CANDLE_CACHE_TTL = 300_000; // 5 minutes

// ─── Types ──────────────────────────────────────────────────────────
export interface QuoteData {
  c: number;  d: number;  dp: number;
  h: number;  l: number;  o: number;  pc: number;
  name: string;  currency: string;  exchange: string;
  fiftyTwoWeekHigh: number;  fiftyTwoWeekLow: number;  volume: number;
}

interface CandleData {
  c: number[];  t: number[];  s: string;
}

// ─── NSE stock database ─────────────────────────────────────────────
import nseStocksData from "./nse-stocks.json";
const NSE_STOCKS: { s: string; n: string }[] = nseStocksData;

export const POPULAR_STOCKS = [
  { symbol: "TCS.NS", name: "Tata Consultancy Services" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "INFY.NS", name: "Infosys" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
  { symbol: "SBIN.NS", name: "State Bank of India" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank" },
  { symbol: "LT.NS", name: "Larsen & Toubro" },
];

// ─── Helper: fetch with dual-endpoint failover + retry ─────────────
/**
 * Tries query1, if rate-limited immediately fails over to query2.
 * Each endpoint gets one retry with backoff before failing over.
 */
async function fetchWithRetry(path: string): Promise<string> {
  for (const base of YAHOO_ENDPOINTS) {
    const url = `${base}${path}`;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, {
          headers: YAHOO_HEADERS,
          cache: "no-store",
        });

        if (response.status === 429) {
          if (attempt === 0) {
            // First attempt — wait briefly and retry same endpoint
            await new Promise((r) => setTimeout(r, 1500));
            continue;
          }
          // Second attempt failed — try next endpoint
          console.warn(`Yahoo 429 on ${base}, failing over...`);
          break;
        }

        if (!response.ok) {
          throw new Error(`Yahoo Finance HTTP ${response.status}`);
        }

        const text = await response.text();
        if (!text || text.startsWith("<") || text.startsWith("Too")) {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          break; // try next endpoint
        }

        return text;
      } catch (err) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        console.error(`fetchWithRetry error on ${base}:`, (err as Error).message);
        break; // try next endpoint
      }
    }
  }

  throw new Error(`All Yahoo Finance endpoints exhausted for ${path}`);
}

// ─── Search (fully local, instant) ─────────────────────────────────
export async function searchStocks(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { count: 0, result: [] };

  const scored = NSE_STOCKS
    .map((stock) => {
      const sym = stock.s.toLowerCase();
      const name = stock.n.toLowerCase();
      const symBase = sym.replace(".ns", "");

      let score = 0;
      if (symBase === q || sym === q) score = 100;
      else if (symBase.startsWith(q)) score = 80;
      else if (name.startsWith(q)) score = 70;
      else if (symBase.includes(q)) score = 50;
      else if (name.includes(q)) score = 40;
      else return null;

      return { stock, score };
    })
    .filter((x): x is { stock: (typeof NSE_STOCKS)[0]; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  return {
    count: scored.length,
    result: scored.map((item) => ({
      description: item.stock.n,
      displaySymbol: item.stock.s,
      symbol: item.stock.s,
      type: "Common Stock",
    })),
  };
}

// ─── Get Quote (cached + retry) ─────────────────────────────────────
export async function getQuote(symbol: string): Promise<QuoteData> {
  // Check cache first
  const cached = quoteCache.get(symbol);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const path = `/${symbol}?interval=1d&range=2d`;
  const text = await fetchWithRetry(path);
  const data = JSON.parse(text);

  const result = data?.chart?.result?.[0];
  const error = data?.chart?.error;

  if (error) {
    throw new Error(`Yahoo Finance Error for ${symbol}: ${error.description || error.code}`);
  }
  if (!result) {
    throw new Error(`No data returned from Yahoo Finance for ${symbol}`);
  }

  const meta = result.meta;
  const c = meta.regularMarketPrice ?? 0;
  const pc = meta.previousClose ?? meta.chartPreviousClose ?? c;
  const d = c - pc;
  const dp = pc > 0 ? (d / pc) * 100 : 0;

  const quote: QuoteData = {
    c, d, dp,
    h: meta.regularMarketDayHigh ?? c,
    l: meta.regularMarketDayLow ?? c,
    o: meta.regularMarketOpen ?? c,
    pc,
    name: meta.longName ?? meta.shortName ?? symbol,
    currency: meta.currency ?? "INR",
    exchange: meta.exchangeName ?? "NSE",
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? 0,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? 0,
    volume: meta.regularMarketVolume ?? 0,
  };

  // Store in cache
  quoteCache.set(symbol, { data: quote, expiresAt: Date.now() + QUOTE_CACHE_TTL });
  return quote;
}

// ─── Get Company Profile ────────────────────────────────────────────
export async function getCompanyProfile(symbol: string) {
  try {
    const q = await getQuote(symbol);
    return {
      name: q.name,
      ticker: symbol,
      exchange: q.exchange,
      finnhubIndustry: "Equities",
      currency: q.currency,
    };
  } catch {
    // Fallback: use our local NSE database for the name
    const stock = NSE_STOCKS.find((s) => s.s === symbol);
    return {
      name: stock?.n ?? symbol,
      ticker: symbol,
      exchange: "NSE",
      finnhubIndustry: "Equities",
      currency: "INR",
    };
  }
}

// ─── Get Stock Candles (cached + retry) ─────────────────────────────
export async function getStockCandles(
  symbol: string,
  _resolution: string,
  fromUnix: number,
  toUnix: number
): Promise<CandleData> {
  // Check cache
  const cacheKey = `${symbol}_${fromUnix}_${toUnix}`;
  const cached = candleCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const path = `/${symbol}?period1=${fromUnix}&period2=${toUnix}&interval=1d`;

  try {
    const text = await fetchWithRetry(path);
    const data = JSON.parse(text);
    const result = data?.chart?.result?.[0];
    const error = data?.chart?.error;

    if (error || !result) {
      console.error(`getStockCandles failed for ${symbol}:`, error || "No result");
      return { c: [], t: [], s: "no_data" };
    }

    const timestamps: number[] = result.timestamp ?? [];
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

    const filtered = timestamps.reduce(
      (acc: { t: number[]; c: number[] }, t, i) => {
        if (closes[i] != null) {
          acc.t.push(t);
          acc.c.push(closes[i]);
        }
        return acc;
      },
      { t: [], c: [] }
    );

    const candles: CandleData = {
      ...filtered,
      s: filtered.t.length > 0 ? "ok" : "no_data",
    };

    // Cache it
    candleCache.set(cacheKey, { data: candles, expiresAt: Date.now() + CANDLE_CACHE_TTL });
    return candles;
  } catch (err) {
    console.error(`getStockCandles exception for ${symbol}:`, err);
    return { c: [], t: [], s: "no_data" };
  }
}
