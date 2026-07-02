import YahooFinanceClass from "yahoo-finance2";

const yf = new (YahooFinanceClass as unknown as new (opts?: object) => typeof YahooFinanceClass)({
  suppressNotices: ["yahooSurvey"],
}) as unknown as {
  quoteSummary: (s: string, o: object) => Promise<YFSummary>;
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

export type EarningItem = {
  ticker: string;
  company: string;
  date: string;       // ISO
  dayLabel: string;   // "Mon", "Tue", etc.
  time: "BMO" | "AMC" | "TBD";
  epsEst: string;
  revEst: string;
  importance: "high" | "medium" | "low";
};

export type EconEvent = {
  title: string;
  date: string;       // ISO
  dayLabel: string;
  timeEt: string;     // "08:30"
  impact: "High" | "Medium" | "Low";
  forecast: string;
  previous: string;
  actual?: string;
};

export type CalendarData = {
  earnings: { thisWeek: EarningItem[]; nextWeek: EarningItem[] };
  econ: { thisWeek: EconEvent[]; nextWeekAvailable: boolean; nextWeek: EconEvent[] };
  ts: number;
};

// ── Key tickers to scan for earnings ──────────────────────────────
const EARNINGS_TICKERS = [
  "AAPL","MSFT","NVDA","GOOGL","AMZN","META","TSLA",
  "AMD","INTC","AVGO","QCOM","MU","TXN","AMAT","LRCX",
  "CRM","ORCL","ADBE","NOW","SNOW","PLTR","PANW",
  "JPM","BAC","GS","MS","V","MA","AXP","C","WFC","BLK",
  "LLY","UNH","JNJ","PFE","ABBV","MRNA",
  "WMT","COST","TGT","HD","MCD","NKE","SBUX","DIS","NFLX",
  "XOM","CVX","OXY","KMI",
  "CAT","BA","GE","RTX","UPS",
  "UBER","PYPL","COIN","SQ","SOFI",
  "NKE","MU","WBA","LEVI","CAG","PAYX","STZ",
];

// 15-minute server cache
let cache: { data: CalendarData; ts: number } | null = null;
const CACHE_TTL = 15 * 60_000;

export async function getCalendarData(): Promise<CalendarData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;
  const [earningsData, econData] = await Promise.all([fetchEarnings(), fetchEcon()]);
  const data: CalendarData = { ...earningsData, econ: econData, ts: Date.now() };
  cache = { data, ts: Date.now() };
  return data;
}

export async function GET() {
  return Response.json(await getCalendarData());
}

// ── Helpers ───────────────────────────────────────────────────────
function weekRange(offset: 0 | 1) {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);
  return { start: monday, end: friday };
}

const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function dayLabel(date: Date) {
  return DAY_LABELS[date.getDay()];
}

function reportTime(date: Date): "BMO" | "AMC" | "TBD" {
  const etHour = parseInt(
    date.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "America/New_York" }),
    10
  );
  if (etHour <= 11) return "BMO";
  if (etHour >= 15) return "AMC";
  return "TBD";
}

function fmtRevenue(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

function importance(ticker: string): "high" | "medium" | "low" {
  const high = new Set(["AAPL","MSFT","NVDA","GOOGL","AMZN","META","TSLA","JPM","BAC","V","MA","WMT","NFLX","AMD","AVGO","LLY","UNH"]);
  const med  = new Set(["QCOM","MU","INTC","CRM","ORCL","ADBE","GS","MS","C","WFC","XOM","CVX","DIS","NKE","SBUX","COST","HD","TGT","MCD","CAT","BA","PYPL","COIN","UBER"]);
  if (high.has(ticker)) return "high";
  if (med.has(ticker))  return "medium";
  return "low";
}

// ── Earnings ─────────────────────────────────────────────────────
async function fetchEarnings() {
  const thisWeek = weekRange(0);
  const nextWeek = weekRange(1);

  const unique = [...new Set(EARNINGS_TICKERS)];
  const results = await Promise.allSettled(
    unique.map(async (ticker) => {
      const r = await yf.quoteSummary(ticker, { modules: ["calendarEvents", "price"] });
      const rawDate = r.calendarEvents?.earnings?.earningsDate?.[0];
      if (!rawDate) return null;
      const date = new Date(rawDate);
      return {
        ticker,
        company: r.price?.shortName ?? r.price?.longName ?? ticker,
        date: date.toISOString(),
        dayLabel: dayLabel(date),
        time: reportTime(date),
        epsEst: r.calendarEvents?.earnings?.earningsAverage != null
          ? `$${r.calendarEvents.earnings.earningsAverage.toFixed(2)}`
          : "—",
        revEst: fmtRevenue(r.calendarEvents?.earnings?.revenueAverage),
        importance: importance(ticker),
        _ts: date.getTime(),
      };
    })
  );

  const all = results
    .filter((r): r is PromiseFulfilledResult<EarningItem & { _ts: number } | null> => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value as EarningItem & { _ts: number })
    .sort((a, b) => a._ts - b._ts);

  const thisW = all.filter((e) => e._ts >= thisWeek.start.getTime() && e._ts <= thisWeek.end.getTime());
  const nextW = all.filter((e) => e._ts >= nextWeek.start.getTime() && e._ts <= nextWeek.end.getTime());

  return {
    earnings: {
      thisWeek: thisW.map(({ _ts, ...e }) => e) as EarningItem[],
      nextWeek: nextW.map(({ _ts, ...e }) => e) as EarningItem[],
    },
  };
}

// ── Economic events ──────────────────────────────────────────────
async function fetchEcon() {
  const [thisWeekRaw, nextWeekRaw] = await Promise.all([
    fetchFF("https://nfs.faireconomy.media/ff_calendar_thisweek.json"),
    fetchFF("https://nfs.faireconomy.media/ff_calendar_nextweek.json"),
  ]);

  return {
    thisWeek: parseFF(thisWeekRaw),
    nextWeek: parseFF(nextWeekRaw),
    nextWeekAvailable: nextWeekRaw !== null,
  };
}

async function fetchFF(url: string): Promise<FFEvent[] | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type FFEvent = {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
  actual?: string;
};

function parseFF(raw: FFEvent[] | null): EconEvent[] {
  if (!raw) return [];
  return raw
    .filter((e) => e.country === "USD" && ["High", "Medium", "Low"].includes(e.impact))
    .map((e) => {
      const d = new Date(e.date);
      const timeEt = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      });
      return {
        title: e.title,
        date: d.toISOString(),
        dayLabel: dayLabel(d),
        timeEt,
        impact: (e.impact as "High" | "Medium" | "Low"),
        forecast: e.forecast || "—",
        previous: e.previous || "—",
        actual: e.actual || undefined,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
