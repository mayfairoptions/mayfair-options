"use client";

import { useState } from "react";

type Trade = {
  ticker: string;
  type: string;
  strike: string;
  date: string;
  return: string;
  status: "Closed" | "Active";
};

type Analyst = {
  name: string;
  handle: string;
  specialty: string;
  trades: number;
  wins: number;
  winRate: string;
  avgReturn: string;
  streak: string;
  tier: string;
  initials: string;
  topTrades: Trade[];
};

const analysts: Analyst[] = [
  {
    name: "Marcus Reynolds",
    handle: "@marcus_r",
    specialty: "Tech & Mega-Cap",
    trades: 142,
    wins: 126,
    winRate: "88.7%",
    avgReturn: "+84%",
    streak: "11W",
    tier: "Lead",
    initials: "MR",
    topTrades: [
      { ticker: "NVDA", type: "Call Spread", strike: "130/140C", date: "Jun 28 '26", return: "+127%", status: "Closed" },
      { ticker: "AMD",  type: "Call",        strike: "150C",     date: "May 15 '26", return: "+201%", status: "Closed" },
      { ticker: "AAPL", type: "Call Spread", strike: "200/210C", date: "Apr 3 '26",  return: "+143%", status: "Closed" },
      { ticker: "MSFT", type: "Call",        strike: "380C",     date: "Mar 18 '26", return: "+95%",  status: "Closed" },
      { ticker: "QQQ",  type: "Call Spread", strike: "460/470C", date: "Feb 7 '26",  return: "+89%",  status: "Closed" },
    ],
  },
  {
    name: "Priya Sharma",
    handle: "@priya_s",
    specialty: "Macro & Index",
    trades: 118,
    wins: 101,
    winRate: "85.6%",
    avgReturn: "+71%",
    streak: "7W",
    tier: "Senior",
    initials: "PS",
    topTrades: [
      { ticker: "SPY", type: "Put Spread", strike: "540/530P", date: "Jun 21 '26", return: "+205%", status: "Closed" },
      { ticker: "QQQ", type: "Put Spread", strike: "450/440P", date: "Apr 28 '26", return: "+167%", status: "Closed" },
      { ticker: "IWM", type: "Call",       strike: "200C",     date: "Mar 12 '26", return: "+134%", status: "Closed" },
      { ticker: "SPY", type: "Call Spread",strike: "530/540C", date: "Feb 19 '26", return: "+112%", status: "Closed" },
      { ticker: "SPY", type: "Put Spread", strike: "490/480P", date: "Jan 8 '26",  return: "+88%",  status: "Closed" },
    ],
  },
  {
    name: "Jordan Kane",
    handle: "@jordan_k",
    specialty: "EV & Momentum",
    trades: 97,
    wins: 83,
    winRate: "85.6%",
    avgReturn: "+92%",
    streak: "5W",
    tier: "Senior",
    initials: "JK",
    topTrades: [
      { ticker: "RIVN", type: "Call",        strike: "15C",     date: "May 30 '26", return: "+245%", status: "Closed" },
      { ticker: "TSLA", type: "Call Spread", strike: "220/230C",date: "Apr 11 '26", return: "+156%", status: "Closed" },
      { ticker: "LCID", type: "Call",        strike: "3C",      date: "Mar 5 '26",  return: "+189%", status: "Closed" },
      { ticker: "TSLA", type: "Call",        strike: "250C",    date: "Jul 18 '26", return: "+68%",  status: "Active" },
      { ticker: "NIO",  type: "Call",        strike: "8C",      date: "Feb 22 '26", return: "+78%",  status: "Closed" },
    ],
  },
  {
    name: "Alex Chen",
    handle: "@alex_c",
    specialty: "Biotech & Small-Cap",
    trades: 74,
    wins: 61,
    winRate: "82.4%",
    avgReturn: "+118%",
    streak: "3W",
    tier: "Analyst",
    initials: "AC",
    topTrades: [
      { ticker: "NVAX", type: "Call",        strike: "12C",  date: "May 2 '26",  return: "+234%", status: "Closed" },
      { ticker: "BMRN", type: "Call",        strike: "95C",  date: "Jan 25 '26", return: "+201%", status: "Closed" },
      { ticker: "SGEN", type: "Call",        strike: "40C",  date: "Mar 1 '26",  return: "+167%", status: "Closed" },
      { ticker: "MRNA", type: "Call Spread", strike: "90/100C", date: "Jun 14 '26", return: "+118%", status: "Closed" },
      { ticker: "BNTX", type: "Call",        strike: "100C", date: "Apr 7 '26",  return: "+89%",  status: "Closed" },
    ],
  },
  {
    name: "Sam Torres",
    handle: "@sam_t",
    specialty: "Energy & Commodities",
    trades: 89,
    wins: 74,
    winRate: "83.1%",
    avgReturn: "+67%",
    streak: "6W",
    tier: "Analyst",
    initials: "ST",
    topTrades: [
      { ticker: "OXY", type: "Call",        strike: "60C",   date: "May 8 '26",  return: "+134%", status: "Closed" },
      { ticker: "USO", type: "Call",        strike: "80C",   date: "Mar 14 '26", return: "+112%", status: "Closed" },
      { ticker: "CVX", type: "Call Spread", strike: "165/175C", date: "Apr 22 '26", return: "+89%", status: "Closed" },
      { ticker: "SLB", type: "Call",        strike: "50C",   date: "Feb 3 '26",  return: "+78%",  status: "Closed" },
      { ticker: "XOM", type: "Call Spread", strike: "120/130C", date: "Jun 18 '26", return: "+67%", status: "Closed" },
    ],
  },
];

const tierStyle: Record<string, { color: string; bg: string; border: string }> = {
  Lead:    { color: "#C9A96E",             bg: "rgba(201,169,110,0.08)",  border: "rgba(201,169,110,0.3)"  },
  Senior:  { color: "rgba(240,234,216,0.7)", bg: "rgba(240,234,216,0.05)", border: "rgba(240,234,216,0.15)" },
  Analyst: { color: "rgba(240,234,216,0.45)", bg: "transparent",           border: "rgba(240,234,216,0.1)"  },
};

function TradeModal({ analyst, onClose }: { analyst: Analyst; onClose: () => void }) {
  const ts = tierStyle[analyst.tier];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(3,6,15,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-sm overflow-hidden"
        style={{ background: "var(--navy-2)", border: "1px solid rgba(201,169,110,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold top line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6" style={{ borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
          <div className="flex items-center gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-sm font-medium"
              style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
            >
              {analyst.initials}
            </div>
            <div>
              <div className="text-base font-medium" style={{ color: "#E8D5A3" }}>{analyst.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "rgba(240,234,216,0.35)" }}>
                {analyst.handle} · {analyst.specialty}
              </div>
            </div>
            <span
              className="text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-sm ml-2"
              style={{ border: `1px solid ${ts.border}`, background: ts.bg, color: ts.color, letterSpacing: "0.12em" }}
            >
              {analyst.tier}
            </span>
          </div>
          <button
            onClick={onClose}
            className="transition-opacity duration-200 hover:opacity-100"
            style={{ color: "rgba(240,234,216,0.3)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 divide-x"
          style={{ borderBottom: "1px solid rgba(201,169,110,0.08)", background: "rgba(201,169,110,0.02)" }}
        >
          {[
            { label: "Win Rate",   value: analyst.winRate   },
            { label: "Avg Return", value: analyst.avgReturn },
            { label: "Streak",     value: analyst.streak    },
          ].map((s) => (
            <div key={s.label} className="py-4 text-center" style={{ borderColor: "rgba(201,169,110,0.08)" }}>
              <div className="text-[9px] tracking-widest uppercase mb-1" style={{ color: "rgba(240,234,216,0.3)" }}>{s.label}</div>
              <div className="text-sm font-medium" style={{ color: "#C9A96E" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Trades label */}
        <div className="px-7 pt-5 pb-3">
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.45)" }}>Top Historical Trades</p>
        </div>

        {/* Trades table */}
        <div className="px-7 pb-7">
          <div style={{ border: "1px solid rgba(201,169,110,0.1)" }}>
            <div
              className="grid text-[9px] tracking-widest uppercase px-4 py-3"
              style={{
                gridTemplateColumns: "1fr 1.2fr 1fr 1fr 0.8fr",
                background: "rgba(201,169,110,0.03)",
                borderBottom: "1px solid rgba(201,169,110,0.08)",
                color: "rgba(201,169,110,0.4)",
              }}
            >
              {["Ticker", "Type", "Strike", "Date", "Return"].map(h => <div key={h}>{h}</div>)}
            </div>
            {analyst.topTrades.map((t, i) => (
              <div
                key={i}
                className="grid items-center px-4 py-3.5 text-xs transition-all duration-200"
                style={{
                  gridTemplateColumns: "1fr 1.2fr 1fr 1fr 0.8fr",
                  borderBottom: i < analyst.topTrades.length - 1 ? "1px solid rgba(201,169,110,0.06)" : "none",
                  background: "transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,169,110,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="font-semibold" style={{ color: "#E8D5A3" }}>{t.ticker}</div>
                <div style={{ color: "rgba(240,234,216,0.5)" }}>{t.type}</div>
                <div className="font-mono" style={{ color: "rgba(240,234,216,0.6)" }}>{t.strike}</div>
                <div style={{ color: "rgba(240,234,216,0.35)" }}>{t.date}</div>
                <div className="font-medium" style={{ color: t.status === "Active" ? "#C9A96E" : "#4ade80" }}>
                  {t.return}
                  {t.status === "Active" && (
                    <span className="ml-1.5 text-[8px] tracking-widest uppercase" style={{ color: "#C9A96E" }}>live</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalystTracker() {
  const [selected, setSelected] = useState<Analyst | null>(null);

  return (
    <section id="analysts" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-[10px] tracking-[0.3em] uppercase" style={{ color: "#C9A96E", letterSpacing: "0.25em" }}>
            Our Team
          </p>
          <h2 className="mb-4 text-3xl font-normal sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
            Analyst <span className="italic text-gold-gradient">Performance</span> Tracker
          </h2>
          <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
            Full transparency on every analyst — every trade logged, every result published. No exceptions.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block" style={{ border: "1px solid rgba(201,169,110,0.12)" }}>
          {/* Header */}
          <div
            className="grid gap-0 text-[9px] tracking-[0.2em] uppercase"
            style={{
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr",
              borderBottom: "1px solid rgba(201,169,110,0.12)",
              background: "rgba(201,169,110,0.03)",
              color: "rgba(201,169,110,0.45)",
              letterSpacing: "0.18em",
            }}
          >
            {["Analyst", "Specialty", "W / L", "Win Rate", "Avg Return", "Streak", "Tier"].map((h) => (
              <div key={h} className="px-6 py-4">{h}</div>
            ))}
          </div>

          {/* Rows */}
          {analysts.map((a, i) => (
            <div
              key={a.handle}
              className="grid items-center transition-all duration-200 cursor-pointer"
              style={{
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr",
                borderBottom: i < analysts.length - 1 ? "1px solid rgba(201,169,110,0.07)" : "none",
                background: "transparent",
              }}
              onClick={() => setSelected(a)}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,169,110,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Analyst */}
              <div className="px-6 py-5 flex items-center gap-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-xs font-medium"
                  style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
                >
                  {a.initials}
                </div>
                <div>
                  <div
                    className="text-sm font-medium transition-opacity duration-200"
                    style={{ color: "#E8D5A3", opacity: 0.75 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
                  >
                    {a.name}
                  </div>
                  <div className="text-[10px]" style={{ color: "rgba(240,234,216,0.3)" }}>{a.handle}</div>
                </div>
              </div>

              {/* Specialty */}
              <div className="px-6 py-5 text-xs" style={{ color: "rgba(240,234,216,0.5)" }}>{a.specialty}</div>

              {/* W/L */}
              <div className="px-6 py-5 font-mono text-xs">
                <span style={{ color: "#C9A96E" }}>{a.wins}</span>
                <span style={{ color: "rgba(201,169,110,0.25)" }}>/{a.trades}</span>
              </div>

              {/* Win Rate */}
              <div className="px-6 py-5">
                <span className="text-sm font-medium" style={{ color: "#C9A96E" }}>{a.winRate}</span>
              </div>

              {/* Avg Return */}
              <div className="px-6 py-5">
                <span className="text-sm" style={{ color: "#E8D5A3" }}>{a.avgReturn}</span>
              </div>

              {/* Streak */}
              <div className="px-6 py-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#C9A96E", animation: "pulse 2s infinite" }} />
                <span className="font-mono text-xs" style={{ color: "rgba(240,234,216,0.7)" }}>{a.streak}</span>
              </div>

              {/* Tier */}
              <div className="px-6 py-5">
                <span
                  className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm"
                  style={{ border: `1px solid ${tierStyle[a.tier].border}`, background: tierStyle[a.tier].bg, color: tierStyle[a.tier].color, letterSpacing: "0.12em" }}
                >
                  {a.tier}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-0" style={{ border: "1px solid rgba(201,169,110,0.12)" }}>
          {analysts.map((a, i) => (
            <div
              key={a.handle}
              className="p-6 cursor-pointer transition-all duration-200"
              style={{ borderBottom: i < analysts.length - 1 ? "1px solid rgba(201,169,110,0.08)" : "none", background: "transparent" }}
              onClick={() => setSelected(a)}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,169,110,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-xs font-medium"
                    style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
                  >
                    {a.initials}
                  </div>
                  <div>
                    <div
                      className="text-sm font-medium transition-opacity duration-200"
                      style={{ color: "#E8D5A3", opacity: 0.75 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
                    >
                      {a.name}
                    </div>
                    <div className="text-[10px]" style={{ color: "rgba(240,234,216,0.35)" }}>{a.specialty}</div>
                  </div>
                </div>
                <span
                  className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-sm"
                  style={{ border: `1px solid ${tierStyle[a.tier].border}`, color: tierStyle[a.tier].color, background: tierStyle[a.tier].bg, letterSpacing: "0.12em" }}
                >
                  {a.tier}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Win Rate", v: a.winRate },
                  { l: "Avg Return", v: a.avgReturn },
                  { l: "Streak", v: a.streak },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="text-center py-3"
                    style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.03)" }}
                  >
                    <div className="text-[9px] tracking-widest uppercase mb-1.5" style={{ color: "rgba(240,234,216,0.3)", letterSpacing: "0.15em" }}>{s.l}</div>
                    <div className="text-sm font-medium" style={{ color: "#C9A96E" }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="mt-5 text-center text-[10px]" style={{ color: "rgba(240,234,216,0.2)" }}>
          Click any analyst to view their top historical trades
        </p>
      </div>

      {/* Modal */}
      {selected && <TradeModal analyst={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
