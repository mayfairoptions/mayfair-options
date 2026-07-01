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

export type MarketDataPayload = {
  quotes: Record<string, { price: number; change: number; changePercent: number }>;
  fearGreed: { score: number; rating: string; previousClose: number; previousWeek: number; previousMonth: number } | null;
  ts: number;
};

export async function getMarketData(): Promise<MarketDataPayload> {
  if (mdCache && Date.now() - mdCache.ts < MD_TTL) return mdCache.data;
  const [quotes, fearGreed] = await Promise.all([fetchQuotes(), fetchFearGreed()]);
  const data: MarketDataPayload = { quotes, fearGreed, ts: Date.now() };
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
