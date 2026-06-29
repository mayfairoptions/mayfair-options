import YahooFinanceClass from "yahoo-finance2";

export const dynamic = "force-dynamic";

const yf = new (YahooFinanceClass as unknown as new (opts?: object) => typeof YahooFinanceClass)({
  suppressNotices: ["yahooSurvey"],
}) as unknown as {
  search: (q: string) => Promise<{ news: YFNewsItem[] }>;
  quoteSummary: (s: string, o: object) => Promise<YFSummary>;
};

type YFNewsItem = {
  uuid?: string;
  title: string;
  publisher: string;
  providerPublishTime: Date | string;
  relatedTickers?: string[];
  link: string;
};

type YFSummary = {
  calendarEvents?: {
    earnings?: {
      earningsDate?: Date[];
      earningsAverage?: number;
      revenueAverage?: number;
    };
  };
  price?: { longName?: string; shortName?: string };
};

export type LiveNewsItem = {
  id: string;
  headline: string;
  source: string;
  time: string;
  tickers: string[];
  category: string;
  sentiment: "bullish" | "bearish" | "neutral";
  link: string;
};

export type LiveEarnings = {
  ticker: string;
  company: string;
  earningsDate: string;
  earningsAverage: number | null;
  revenueAverage: number | null;
};

const SEARCHES = [
  { query: "stock market today",               category: "Macro"    },
  { query: "Federal Reserve interest rates",   category: "Fed"      },
  { query: "earnings results beat miss",       category: "Earnings" },
  { query: "technology stocks AI chips",       category: "Tech"     },
  { query: "oil energy OPEC crude",            category: "Energy"   },
];

const EARNINGS_TICKERS = ["NVDA", "AAPL", "TSLA", "META", "MSFT", "AMZN", "GOOGL", "AMD", "NFLX", "JPM"];

function sentiment(title: string): "bullish" | "bearish" | "neutral" {
  const t = title.toLowerCase();
  if (["surge", "rally", "beat", "gains", "record", "upgrade", "rise", "climb", "jump", "soar"].some(w => t.includes(w))) return "bullish";
  if (["fall", "drop", "miss", "crash", "downgrade", "decline", "plunge", "slide", "tumble", "cut"].some(w => t.includes(w))) return "bearish";
  return "neutral";
}

export async function GET() {
  const [news, earnings] = await Promise.all([fetchNews(), fetchEarnings()]);
  return Response.json({ news, earnings, ts: Date.now() });
}

async function fetchNews(): Promise<LiveNewsItem[]> {
  const results = await Promise.allSettled(
    SEARCHES.map(async ({ query, category }) => {
      const r = await yf.search(query);
      return (r.news ?? []).map((n) => ({
        id: n.uuid ?? n.link,
        headline: n.title,
        source: n.publisher,
        time: new Date(n.providerPublishTime).toISOString(),
        tickers: (n.relatedTickers ?? []).slice(0, 4),
        category,
        sentiment: sentiment(n.title),
        link: n.link,
      }));
    })
  );

  const seen = new Set<string>();
  const all: LiveNewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const item of r.value) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          all.push(item);
        }
      }
    }
  }

  return all
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 25);
}

async function fetchEarnings(): Promise<LiveEarnings[]> {
  const results = await Promise.allSettled(
    EARNINGS_TICKERS.map(async (ticker) => {
      const r = await yf.quoteSummary(ticker, { modules: ["calendarEvents", "price"] });
      const date = r.calendarEvents?.earnings?.earningsDate?.[0];
      if (!date) return null;
      const d = new Date(date);
      if (d < new Date()) return null;
      return {
        ticker,
        company: r.price?.longName ?? r.price?.shortName ?? ticker,
        earningsDate: d.toISOString(),
        earningsAverage: r.calendarEvents?.earnings?.earningsAverage ?? null,
        revenueAverage: r.calendarEvents?.earnings?.revenueAverage ?? null,
      };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<LiveEarnings> => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value)
    .sort((a, b) => new Date(a.earningsDate).getTime() - new Date(b.earningsDate).getTime());
}
