"use client";

import { useState } from "react";

type Briefing = {
  id: string;
  date: string;
  analyst: string;
  initials: string;
  title: string;
  outlook: "Bullish" | "Bearish" | "Neutral";
  bias: string;
  keyLevels: { ticker: string; support: string; resistance: string }[];
  watchlist: string[];
  body: string;
};

const BRIEFINGS: Briefing[] = [
  {
    id: "1",
    date: "Today · Pre-Market",
    analyst: "Marcus Reynolds",
    initials: "MR",
    title: "CPI Data Risk — Positioning for Volatility",
    outlook: "Neutral",
    bias: "Cautious with bullish lean above SPY $538",
    keyLevels: [
      { ticker: "SPY",  support: "$534",  resistance: "$542" },
      { ticker: "QQQ",  support: "$470",  resistance: "$478" },
      { ticker: "NVDA", support: "$135",  resistance: "$142" },
    ],
    watchlist: ["NVDA 140C Jul18", "SPY 538P Jul11", "AMD 165C Jul18"],
    body: "Pre-CPI session calls for disciplined position sizing. Markets have priced in a 0.2% MoM reading — any surprise in either direction will trigger vol expansion. Favour defined-risk structures. Avoid naked calls or puts into the number. SPY holding above $536 pre-market is a green light for continuation longs. Below $534 we flip defensive.",
  },
  {
    id: "2",
    date: "Yesterday · Pre-Market",
    analyst: "Priya Sharma",
    initials: "PS",
    title: "FOMC Minutes Digest — Rate Path Unchanged",
    outlook: "Bullish",
    bias: "Risk-on above QQQ $472. Tech leadership continuing",
    keyLevels: [
      { ticker: "QQQ",  support: "$469",  resistance: "$480" },
      { ticker: "AAPL", support: "$208",  resistance: "$215" },
      { ticker: "MSFT", support: "$415",  resistance: "$425" },
    ],
    watchlist: ["QQQ 478C Jul18", "AAPL 212.5C Jul25", "MSFT 420C Aug15"],
    body: "FOMC minutes confirmed no surprises — the committee remains data-dependent with no imminent pivot. Tech sector responded positively overnight. Nvidia and AAPL are leading pre-market. Today's session should see continuation from yesterday's breakout. Target QQQ $478 as near-term resistance. Any dip to $470–$472 is a buy-the-dip opportunity with defined risk call spreads.",
  },
];

const outlookStyle = {
  Bullish: { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)", icon: "▲" },
  Bearish: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", icon: "▼" },
  Neutral: { color: "#C9A96E", bg: "rgba(201,169,110,0.08)", border: "rgba(201,169,110,0.25)", icon: "◆" },
};

export default function Briefing() {
  const [open, setOpen] = useState<string>("1");

  return (
    <div className="flex flex-col gap-4">
      {BRIEFINGS.map((b) => {
        const style = outlookStyle[b.outlook];
        const isOpen = open === b.id;
        return (
          <div
            key={b.id}
            className="rounded-sm overflow-hidden"
            style={{ border: `1px solid ${isOpen ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.08)"}`, background: "rgba(8,13,26,0.6)" }}
          >
            {/* Header — always visible */}
            <button
              className="w-full flex items-start justify-between gap-4 p-5 text-left"
              onClick={() => setOpen(isOpen ? "" : b.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold"
                  style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
                >
                  {b.initials}
                </div>
                <div>
                  <p className="text-sm font-medium mb-0.5" style={{ color: "#E8D5A3" }}>{b.title}</p>
                  <p className="text-[10px]" style={{ color: "rgba(240,234,216,0.3)" }}>{b.analyst} · {b.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm hidden sm:inline"
                  style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                >
                  {style.icon} {b.outlook}
                </span>
                <svg
                  className="h-4 w-4 transition-transform duration-200"
                  style={{ color: "rgba(201,169,110,0.4)", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="px-5 pb-6 flex flex-col gap-5" style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}>
                {/* Bias */}
                <div className="pt-4">
                  <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(201,169,110,0.4)" }}>Analyst Bias</p>
                  <p className="text-sm" style={{ color: "rgba(240,234,216,0.7)", fontWeight: 300 }}>{b.bias}</p>
                </div>

                {/* Body */}
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,234,216,0.5)", fontWeight: 300 }}>
                  {b.body}
                </p>

                {/* Key levels */}
                <div>
                  <p className="text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(201,169,110,0.4)" }}>Key Levels</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {b.keyLevels.map((l) => (
                      <div
                        key={l.ticker}
                        className="rounded-sm px-4 py-3"
                        style={{ background: "rgba(201,169,110,0.03)", border: "1px solid rgba(201,169,110,0.08)" }}
                      >
                        <p className="text-xs font-semibold mb-2" style={{ color: "#E8D5A3" }}>{l.ticker}</p>
                        <div className="flex justify-between text-[10px]">
                          <span style={{ color: "#f87171" }}>S {l.support}</span>
                          <span style={{ color: "#4ade80" }}>R {l.resistance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Watchlist */}
                <div>
                  <p className="text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(201,169,110,0.4)" }}>Watchlist</p>
                  <div className="flex flex-wrap gap-2">
                    {b.watchlist.map((w) => (
                      <span
                        key={w}
                        className="px-3 py-1.5 rounded-sm text-xs"
                        style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)", color: "#C9A96E" }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
