"use client";

import { useEffect, useState } from "react";
import type { LiveNewsItem, LiveEarnings } from "@/app/api/news/route";

type Category = "All" | "Macro" | "Earnings" | "Tech" | "Energy" | "Fed";
type Tab = "news" | "catalysts";

const CATEGORIES: Category[] = ["All", "Fed", "Macro", "Earnings", "Tech", "Energy"];

const sentimentStyle = {
  bullish: { color: "#4ade80", bg: "rgba(74,222,128,0.08)",   border: "rgba(74,222,128,0.25)",  icon: "▲" },
  bearish: { color: "#f87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.25)", icon: "▼" },
  neutral: { color: "#C9A96E", bg: "rgba(201,169,110,0.08)",  border: "rgba(201,169,110,0.2)",  icon: "◆" },
};

// Static high-impact events that aren't ticker-earnings
const STATIC_EVENTS = [
  {
    id: "fomc-jul",
    ticker: "SPY",
    company: "S&P 500",
    event: "FOMC Rate Decision",
    date: "2026-07-29T18:00:00.000Z",
    impact: "high" as const,
    direction: "neutral" as const,
    detail: "No cut expected. Hawkish tone could pressure equities. Dot plot revisions are the key watch item.",
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtEarningsDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtRevenue(n: number | null) {
  if (!n) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

export default function NewsFeed() {
  const [tab, setTab] = useState<Tab>("news");
  const [category, setCategory] = useState<Category>("All");
  const [news, setNews] = useState<LiveNewsItem[]>([]);
  const [earnings, setEarnings] = useState<LiveEarnings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          setNews(data.news ?? []);
          setEarnings(data.earnings ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 5 * 60_000);
    return () => clearInterval(id);
  }, []);

  const filteredNews = news.filter((n) => category === "All" || n.category === category);

  // Merge live earnings + static events, sorted by date
  const allCatalysts = [
    ...earnings.map((e) => ({
      id: e.ticker,
      ticker: e.ticker,
      company: e.company,
      event: "Earnings Report",
      date: e.earningsDate,
      impact: "high" as const,
      direction: "neutral" as const,
      detail: [
        e.earningsAverage ? `EPS est. $${e.earningsAverage.toFixed(2)}` : null,
        e.revenueAverage ? `Revenue est. ${fmtRevenue(e.revenueAverage)}` : null,
      ].filter(Boolean).join(" · ") || "Upcoming earnings — options market pricing elevated IV.",
    })),
    ...STATIC_EVENTS,
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-sm p-1 self-start" style={{ background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.1)" }}>
        {(["news", "catalysts"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200 capitalize"
            style={{
              background: tab === t ? "rgba(201,169,110,0.12)" : "transparent",
              color: tab === t ? "#C9A96E" : "rgba(240,234,216,0.35)",
              border: tab === t ? "1px solid rgba(201,169,110,0.25)" : "1px solid transparent",
            }}
          >
            {t}
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
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-sm px-4 py-4 animate-pulse" style={{ border: "1px solid rgba(201,169,110,0.08)", background: "rgba(8,13,26,0.6)", height: 72 }} />
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "rgba(240,234,216,0.25)" }}>No articles found for this category.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredNews.map((item) => {
                const s = sentimentStyle[item.sentiment];
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-sm overflow-hidden transition-all duration-200 group"
                    style={{ border: "1px solid rgba(201,169,110,0.08)", background: "rgba(8,13,26,0.6)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.08)")}
                  >
                    <div className="px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug mb-2 group-hover:text-[#E8D5A3] transition-colors" style={{ color: "#D4C9A8" }}>
                            {item.headline}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px]" style={{ color: "rgba(240,234,216,0.3)" }}>
                              {item.source} · {timeAgo(item.time)}
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
                        <span
                          className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm hidden sm:inline shrink-0"
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                        >
                          {s.icon} {item.sentiment}
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Catalysts tab ── */}
      {tab === "catalysts" && (
        <div className="flex flex-col gap-3">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="rounded-sm p-5 animate-pulse" style={{ background: "rgba(8,13,26,0.6)", border: "1px solid rgba(201,169,110,0.08)", height: 88 }} />
            ))
          ) : (
            allCatalysts.map((c) => {
              const s = sentimentStyle[c.direction];
              const impColor = c.impact === "high" ? "#f87171" : "#C9A96E";
              const impBorder = c.impact === "high" ? "rgba(248,113,113,0.25)" : "rgba(201,169,110,0.25)";
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
                        <p className="text-[10px]" style={{ color: "rgba(240,234,216,0.35)" }}>
                          {c.company} · {fmtEarningsDate(c.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm hidden sm:inline"
                        style={{ color: impColor, border: `1px solid ${impBorder}` }}
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
            })
          )}
        </div>
      )}

      {!loading && (
        <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
          Live · News refreshes every 5 min · Earnings dates from Yahoo Finance
        </p>
      )}
    </div>
  );
}
