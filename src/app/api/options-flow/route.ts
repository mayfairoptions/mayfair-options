import YahooFinanceClass from "yahoo-finance2";

const yf = new (YahooFinanceClass as unknown as new (opts?: object) => typeof YahooFinanceClass)({
  suppressNotices: ["yahooSurvey"],
}) as unknown as {
  options: (ticker: string, opts?: { date?: Date }) => Promise<YFOptionsResult>;
};

type YFContract = {
  contractSymbol: string;
  strike: number;
  lastPrice: number;
  volume?: number;
  openInterest?: number;
  impliedVolatility?: number;
  expiration: Date | string;
  lastTradeDate?: Date | string;
  inTheMoney?: boolean;
};

type YFOptionsResult = {
  expirationDates: Date[];
  options: Array<{ calls: YFContract[]; puts: YFContract[] }>;
};

export type FlowItem = {
  time: string;
  ticker: string;
  type: "Call" | "Put";
  strike: string;
  expiry: string;
  premium: string;
  premiumRaw: number;
  volume: string;
  oi: string;
  iv: string;
  sentiment: "Bullish" | "Bearish";
  itm: boolean;
  isNew: boolean;
};

const TICKERS = ["NVDA", "SPY", "AAPL", "TSLA", "QQQ", "AMD", "META", "MSFT", "GOOGL", "AMZN"];
const MIN_VOLUME  = 50;
const MIN_PREMIUM = 50_000;
const MIN_IV      = 0.05; // 5% — filters out meaningless deep-ITM near-expiry noise

// 1-minute in-memory cache
let cache: { data: object; ts: number } | null = null;
const CACHE_TTL = 60_000;

export type FlowPayload = { flow: FlowItem[]; callPremium: number; putPremium: number; ts: number };

export async function getOptionsFlowData(): Promise<FlowPayload> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data as FlowPayload;

  const results = await Promise.allSettled(TICKERS.map(fetchTicker));
  const all: FlowItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  all.sort((a, b) => b.premiumRaw - a.premiumRaw);
  const flow = all.slice(0, 40);

  const callPremium = flow.filter(f => f.type === "Call").reduce((s, f) => s + f.premiumRaw, 0);
  const putPremium  = flow.filter(f => f.type === "Put").reduce((s, f) => s + f.premiumRaw, 0);

  const data: FlowPayload = { flow, callPremium, putPremium, ts: Date.now() };
  cache = { data, ts: Date.now() };
  return data;
}

export async function GET() {
  return Response.json(await getOptionsFlowData());
}

async function fetchTicker(ticker: string): Promise<FlowItem[]> {
  const first = await yf.options(ticker);
  const dates = first.expirationDates ?? [];

  // Pick a medium-term expiry (>= 7 days out) for more meaningful flow
  const sevenDaysOut = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const medDate = dates.find((d) => new Date(d) >= sevenDaysOut);

  const fetches = [first];
  if (medDate) {
    const second = await yf.options(ticker, { date: new Date(medDate) }).catch(() => null);
    if (second) fetches.push(second);
  }

  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // last 24 h
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;

  const items: FlowItem[] = [];
  for (const result of fetches) {
    const expResult = result.options[0];
    if (!expResult) continue;

    const contracts: Array<YFContract & { type: "Call" | "Put" }> = [
      ...expResult.calls.map((c) => ({ ...c, type: "Call" as const })),
      ...expResult.puts.map((c) => ({ ...c, type: "Put" as const })),
    ];

    for (const c of contracts) {
      const vol = c.volume ?? 0;
      const price = c.lastPrice ?? 0;
      const iv = c.impliedVolatility ?? 0;
      if (vol < MIN_VOLUME || price <= 0 || iv < MIN_IV) continue;

      const premium = vol * price * 100;
      if (premium < MIN_PREMIUM) continue;

      const tradeTs = c.lastTradeDate ? new Date(c.lastTradeDate).getTime() : 0;
      if (tradeTs < cutoff) continue;

      const tradeTime = c.lastTradeDate
        ? new Date(c.lastTradeDate).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/New_York",
          })
        : "—";

      const expiryStr = new Date(c.expiration).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });

      items.push({
        time: tradeTime,
        ticker,
        type: c.type,
        strike: `$${c.strike}${c.type === "Call" ? "C" : "P"}`,
        expiry: expiryStr,
        premium: fmtPremium(premium),
        premiumRaw: premium,
        volume: vol.toLocaleString(),
        oi: (c.openInterest ?? 0).toLocaleString(),
        iv: `${(iv * 100).toFixed(0)}%`,
        sentiment: c.type === "Call" ? "Bullish" : "Bearish",
        itm: c.inTheMoney ?? false,
        isNew: tradeTs > fiveMinAgo,
      });
    }
  }

  return items;
}

function fmtPremium(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}
