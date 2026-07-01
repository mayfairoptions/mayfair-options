import YahooFinanceClass from "yahoo-finance2";
const yahooFinance = new (YahooFinanceClass as unknown as new (opts?: object) => typeof YahooFinanceClass)({
  suppressNotices: ["yahooSurvey"],
});

export const dynamic = "force-dynamic";

const SYMBOLS = [
  // Hero tickers
  "QQQ", "SPY", "AMD", "NVDA", "SPCX", "TSLA", "AAPL", "^VIX",
  // Sector ETFs
  "XLK", "XLC", "XLY", "XLI", "XLF", "XLV", "XLRE", "XLB", "XLU", "XLP", "XLE",
];

let mdCache: { data: MarketDataPayload; ts: number } | null = null;
const MD_TTL = 60_000;

export type TrendingTicker = { sym: string; price: number; change: number; changePercent: number };

export type MarketDataPayload = {
  quotes: Record<string, { price: number; change: number; changePercent: number }>;
  fearGreed: { score: number; rating: string; previousClose: number; previousWeek: number; previousMonth: number } | null;
  trending: TrendingTicker[];
  ts: number;
};

export async function getMarketData(): Promise<MarketDataPayload> {
  if (mdCache && Date.now() - mdCache.ts < MD_TTL) return mdCache.data;
  const [quotes, fearGreed, trending] = await Promise.all([fetchQuotes(), fetchFearGreed(), fetchTrending()]);
  const data: MarketDataPayload = { quotes, fearGreed, trending, ts: Date.now() };
  mdCache = { data, ts: Date.now() };
  return data;
}

export async function GET() {
  return Response.json(await getMarketData());
}

async function fetchQuotes() {
  const out: Record<string, { price: number; change: number; changePercent: number }> = {};
  await Promise.all(
    SYMBOLS.map(async (sym) => {
      try {
        const q = await yahooFinance.quote(sym);
        if (q) {
          out[sym] = {
            price: (q as { regularMarketPrice?: number }).regularMarketPrice ?? 0,
            change: (q as { regularMarketChange?: number }).regularMarketChange ?? 0,
            changePercent: (q as { regularMarketChangePercent?: number }).regularMarketChangePercent ?? 0,
          };
        }
      } catch {
        // skip failed symbol
      }
    })
  );
  return out;
}

async function fetchTrending(): Promise<TrendingTicker[]> {
  try {
    const yf = yahooFinance as unknown as {
      trendingSymbols: (region: string, opts?: { count?: number }) => Promise<{ quotes: { symbol: string }[] }>;
    };
    const result = await yf.trendingSymbols("US", { count: 10 });
    const symbols = (result.quotes ?? [])
      .map((q) => q.symbol)
      .filter((s) => s && !s.includes("=") && !s.includes("/")) // drop forex/crypto pairs
      .slice(0, 8);

    const tickers = await Promise.all(
      symbols.map(async (sym) => {
        try {
          const q = await yahooFinance.quote(sym);
          if (!q) return null;
          return {
            sym,
            price: (q as { regularMarketPrice?: number }).regularMarketPrice ?? 0,
            change: (q as { regularMarketChange?: number }).regularMarketChange ?? 0,
            changePercent: (q as { regularMarketChangePercent?: number }).regularMarketChangePercent ?? 0,
          };
        } catch {
          return null;
        }
      })
    );

    return tickers.filter((t): t is TrendingTicker => t !== null);
  } catch {
    return [];
  }
}

async function fetchFearGreed() {
  try {
    const res = await fetch(
      "https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
      { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const fg = data?.fear_and_greed;
    if (!fg) return null;
    return {
      score: Math.round(fg.score),
      rating: (fg.rating as string) ?? "neutral",
      previousClose: Math.round(fg.previous_close ?? fg.score),
      previousWeek: Math.round(fg.previous_1_week ?? fg.score),
      previousMonth: Math.round(fg.previous_1_month ?? fg.score),
    };
  } catch {
    return null;
  }
}
