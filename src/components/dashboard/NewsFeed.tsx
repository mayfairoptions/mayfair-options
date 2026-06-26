"use client";

import { useState } from "react";

type NewsItem = {
  id: string;
  headline: string;
  source: string;
  time: string;
  tickers: string[];
  category: Category;
  sentiment: "bullish" | "bearish" | "neutral";
  summary: string;
};

type Catalyst = {
  id: string;
  ticker: string;
  company: string;
  event: string;
  date: string;
  impact: "high" | "medium" | "low";
  direction: "bullish" | "bearish" | "neutral";
  detail: string;
};

type Category = "All" | "Macro" | "Earnings" | "Tech" | "Energy" | "Fed";
type Tab = "news" | "catalysts";

const NEWS: NewsItem[] = [
  {
    id: "1",
    headline: "Fed Officials Signal Patience on Rate Cuts as Inflation Stays Sticky",
    source: "Reuters",
    time: "12m ago",
    tickers: ["SPY", "QQQ", "TLT"],
    category: "Fed",
    sentiment: "bearish",
    summary: "Multiple Fed governors reiterated a data-dependent stance, pushing back on market expectations for a July cut. Treasury yields rose on the commentary.",
  },
  {
    id: "2",
    headline: "Nvidia CEO Jensen Huang Teases Next-Gen Blackwell Ultra Chip at Developer Conference",
    source: "Bloomberg",
    time: "34m ago",
    tickers: ["NVDA", "AMD", "INTC"],
    category: "Tech",
    sentiment: "bullish",
    summary: "Huang confirmed Blackwell Ultra production ramp is ahead of schedule, with major cloud providers already in queue. Shares up 3% pre-market.",
  },
  {
    id: "3",
    headline: "Apple Vision Pro 2 Reportedly Entering Mass Production in Q4",
    source: "The Information",
    time: "1h ago",
    tickers: ["AAPL", "GOOG"],
    category: "Tech",
    sentiment: "bullish",
    summary: "Supply chain sources indicate Apple has placed orders with Foxconn for Vision Pro 2, suggesting a Q1 2027 launch window is likely.",
  },
  {
    id: "4",
    headline: "CPI Expected to Show Cooling Inflation — Options Market Pricing 1.2% SPY Move",
    source: "MarketWatch",
    time: "2h ago",
    tickers: ["SPY", "VIX", "TLT"],
    category: "Macro",
    sentiment: "neutral",
    summary: "Tomorrow's CPI print is the most watched event of the week. Options market implies a ±1.2% move in SPY. Consensus forecast at 0.2% MoM.",
  },
  {
    id: "5",
    headline: "Tesla Deliveries Miss Estimates for Third Consecutive Quarter",
    source: "CNBC",
    time: "2h ago",
    tickers: ["TSLA"],
    category: "Earnings",
    sentiment: "bearish",
    summary: "Tesla delivered 384K vehicles in Q2, below the 390K analyst consensus. Production was impacted by factory shutdowns in Shanghai during May.",
  },
  {
    id: "6",
    headline: "Oil Slides 2% as OPEC+ Signals Output Increase for August",
    source: "FT",
    time: "3h ago",
    tickers: ["XOM", "CVX", "OXY"],
    category: "Energy",
    sentiment: "bearish",
    summary: "OPEC+ agreed to increase output by 400K barrels/day starting August, putting pressure on crude prices already under pressure from weak demand data.",
  },
  {
    id: "7",
    headline: "Meta AI Ad Tools Drive Record Q1 Revenue Beat — Stock Hits All-Time High",
    source: "WSJ",
    time: "4h ago",
    tickers: ["META"],
    category: "Earnings",
    sentiment: "bullish",
    summary: "Meta reported $36.5B in Q1 revenue, up 27% YoY, beating estimates by $1.2B. AI-powered ad targeting cited as the primary growth driver.",
  },
  {
    id: "8",
    headline: "Amazon AWS Revenue Growth Reaccelerates to 17% — Cloud Cycle Recovery Intact",
    source: "Barron's",
    time: "5h ago",
    tickers: ["AMZN", "MSFT", "GOOGL"],
    category: "Earnings",
    sentiment: "bullish",
    summary: "AWS grew 17% YoY vs 15% expected, signaling the cloud infrastructure spending cycle is recovering faster than anticipated.",
  },
];

const CATALYSTS: Catalyst[] = [
  {
    id: "1",
    ticker: "NVDA",
    company: "Nvidia",
    event: "Earnings Report",
    date: "Jul 25 · After Close",
    impact: "high",
    direction: "bullish",
    detail: "Blackwell ramp + data center demand expected to drive a major beat. Options market implying 8–10% move.",
  },
  {
    id: "2",
    ticker: "AAPL",
    company: "Apple",
    event: "WWDC Product Announcements",
    date: "Jul 14 · 10:00 AM PT",
    impact: "high",
    direction: "bullish",
    detail: "AI features and iOS 19 reveal. Potential hardware surprise could be a catalyst. Watch for Vision Pro 2 hints.",
  },
  {
    id: "3",
    ticker: "SPY",
    company: "S&P 500",
    event: "FOMC Rate Decision",
    date: "Jul 30 · 2:00 PM ET",
    impact: "high",
    direction: "neutral",
    detail: "No cut expected. Hawkish tone could pressure equities. Dot plot revisions are the key watch item.",
  },
  {
    id: "4",
    ticker: "TSLA",
    company: "Tesla",
    event: "Robotaxi Launch Event",
    date: "Aug 8 · TBD",
    impact: "high",
    direction: "bullish",
    detail: "Elon confirmed a robotaxi launch event in Austin. Execution will determine if this is a buy-the-news or sell-the-news moment.",
  },
  {
    id: "5",
    ticker: "META",
    company: "Meta Platforms",
    event: "Llama 4 Model Release",
    date: "Jul 18 · TBD",
    impact: "medium",
    direction: "bullish",
    detail: "Meta's next-gen open-source AI model expected to compete directly with GPT-5. Developer adoption could accelerate AI ad tools.",
  },
  {
    id: "6",
    ticker: "XOM",
    company: "ExxonMobil",
    event: "OPEC+ August Output Meeting",
    date: "Jul 31 · TBD",
    impact: "medium",
    direction: "bearish",
    detail: "Output increase likely. Energy sector headwinds expected if crude falls below $75/barrel.",
  },
];

const CATEGORIES: Category[] = ["All", "Fed", "Macro", "Earnings", "Tech", "Energy"];

const sentimentStyle = {
  bullish: { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", icon: "▲" },
  bearish: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", icon: "▼" },
  neutral: { color: "#C9A96E",  bg: "rgba(201,169,110,0.08)", border: "rgba(201,169,110,0.2)",  icon: "◆" },
};

const impactStyle = {
  high:   { color: "#f87171", border: "rgba(248,113,113,0.25)" },
  medium: { color: "#C9A96E",  border: "rgba(201,169,110,0.25)" },
  low:    { color: "rgba(240,234,216,0.3)", border: "rgba(240,234,216,0.1)" },
};

export default function NewsFeed() {
  const [tab, setTab] = useState<Tab>("news");
  const [category, setCategory] = useState<Category>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredNews = NEWS.filter((n) => category === "All" || n.category === category);

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-sm p-1 self-start" style={{ background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.1)" }}>
        {([
          { key: "news", label: "News" },
          { key: "catalysts", label: "Catalysts" },
        ] as { key: Tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-5 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              background: tab === t.key ? "rgba(201,169,110,0.12)" : "transparent",
              color: tab === t.key ? "#C9A96E" : "rgba(240,234,216,0.35)",
              border: tab === t.key ? "1px solid rgba(201,169,110,0.25)" : "1px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── News tab ── */}
      {tab === "news" && (
        <div className="flex flex-col gap-5">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-3 py-1.5 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
                style={{
                  background: category === c ? "rgba(201,169,110,0.12)" : "transparent",
                  border: `1px solid ${category === c ? "rgba(201,169,110,0.35)" : "rgba(240,234,216,0.08)"}`,
                  color: category === c ? "#C9A96E" : "rgba(240,234,216,0.3)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* News cards */}
          <div className="flex flex-col gap-3">
            {filteredNews.map((item) => {
              const s = sentimentStyle[item.sentiment];
              const isOpen = expanded === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-sm overflow-hidden transition-all duration-200"
                  style={{ border: `1px solid ${isOpen ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.08)"}`, background: "rgba(8,13,26,0.6)" }}
                >
                  <button
                    className="w-full text-left px-4 py-4"
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug mb-2" style={{ color: "#E8D5A3" }}>
                          {item.headline}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px]" style={{ color: "rgba(240,234,216,0.3)" }}>
                            {item.source} · {item.time}
                          </span>
                          {item.tickers.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm"
                              style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", color: "rgba(201,169,110,0.7)" }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm hidden sm:inline"
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                        >
                          {s.icon} {item.sentiment}
                        </span>
                        <svg
                          className="h-4 w-4 transition-transform duration-200 shrink-0"
                          style={{ color: "rgba(201,169,110,0.4)", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(201,169,110,0.06)" }}>
                      <p className="pt-3 text-sm leading-relaxed" style={{ color: "rgba(240,234,216,0.5)", fontWeight: 300 }}>
                        {item.summary}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Catalysts tab ── */}
      {tab === "catalysts" && (
        <div className="flex flex-col gap-3">
          {CATALYSTS.map((c) => {
            const s = sentimentStyle[c.direction];
            const imp = impactStyle[c.impact];
            return (
              <div
                key={c.id}
                className="rounded-sm p-4 md:p-5"
                style={{ background: "rgba(8,13,26,0.6)", border: "1px solid rgba(201,169,110,0.08)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold"
                      style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", color: "#C9A96E" }}
                    >
                      {c.ticker.slice(0, 4)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{c.event}</p>
                      <p className="text-[10px]" style={{ color: "rgba(240,234,216,0.35)" }}>{c.company} · {c.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm hidden sm:inline"
                      style={{ color: imp.color, border: `1px solid ${imp.border}`, background: "transparent" }}
                    >
                      {c.impact}
                    </span>
                    <span
                      className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                    >
                      {s.icon} {c.direction}
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
                  {c.detail}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
        Sample data — wire to Benzinga, Polygon.io News, or Alpaca News API for live feed
      </p>
    </div>
  );
}
