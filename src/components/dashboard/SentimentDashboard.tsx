"use client";

import { useEffect, useState } from "react";

type Quote = { price: number; change: number; changePercent: number };
type FearGreed = {
  score: number;
  rating: string;
  previousClose: number;
  previousWeek: number;
  previousMonth: number;
};
type MarketData = {
  quotes: Record<string, Quote>;
  fearGreed: FearGreed | null;
  ts: number;
};

// ── Fear & Greed gauge ───────────────────────────────────────────
const GAUGE_ZONES = [
  { color: "#f87171" }, // Extreme Fear  0–20%
  { color: "#fb923c" }, // Fear         20–40%
  { color: "#fbbf24" }, // Neutral      40–60%
  { color: "#86efac" }, // Greed        60–80%
  { color: "#4ade80" }, // Extreme Greed 80–100%
];

function FearGreedGauge({ score }: { score: number }) {
  const s = Math.max(0, Math.min(100, score));

  const label =
    s <= 25 ? "Extreme Fear" :
    s <= 45 ? "Fear" :
    s <= 55 ? "Neutral" :
    s <= 75 ? "Greed" : "Extreme Greed";

  const color =
    s <= 25 ? "#f87171" :
    s <= 45 ? "#fb923c" :
    s <= 55 ? "#fbbf24" :
    s <= 75 ? "#86efac" : "#4ade80";

  const R = 80, cx = 100, cy = 100;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt  = (deg: number, r = R) => ({
    x: cx + r * Math.cos(rad(deg)),
    y: cy + r * Math.sin(rad(deg)),
  });

  // Semicircle: -180° (left) sweeping clockwise to 0° (right)
  const needleDeg = -180 + (s / 100) * 180;
  const start     = pt(-180); // (20, 100)
  const nEnd      = pt(needleDeg);
  const dot       = pt(needleDeg, R - 5);

  // Full track
  const trackPath = `M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${pt(0).x} ${pt(0).y}`;

  // Fill: always minor arc (large-arc=0, sweep clockwise=1)
  const fillPath = s <= 0
    ? null
    : s >= 100
    ? trackPath
    : `M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${nEnd.x} ${nEnd.y}`;

  // Zone background segments (5 × 36°)
  const zoneArcs = GAUGE_ZONES.map((z, i) => {
    const from = pt(-180 + i * 36);
    const to   = pt(-180 + (i + 1) * 36);
    return { ...z, d: `M ${from.x} ${from.y} A ${R} ${R} 0 0 1 ${to.x} ${to.y}` };
  });

  // viewBox: x 10→190, y 10→118  (arc top at y=20; stroke extends to y=13; text to y≈114)
  return (
    <div className="flex flex-col items-center w-full">
      <svg viewBox="10 10 180 108" className="w-full max-w-xs">
        {/* Coloured zone track */}
        {zoneArcs.map((z, i) => (
          <path key={i} d={z.d} fill="none" stroke={z.color} strokeWidth="14" strokeLinecap="butt" opacity="0.12" />
        ))}
        {/* Dark base track */}
        <path d={trackPath} fill="none" stroke="rgba(240,234,216,0.04)" strokeWidth="14" strokeLinecap="round" />
        {/* Fill */}
        {fillPath && (
          <path d={fillPath} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        )}
        {/* Needle dot */}
        <circle cx={dot.x} cy={dot.y} r="5" fill={color} />
        {/* Score */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fontWeight="300" fill="#F0EAD8">{s}</text>
        {/* End labels */}
        <text x="24"  y={cy + 15} fontSize="8" fill="rgba(248,113,113,0.6)" textAnchor="middle">Fear</text>
        <text x="176" y={cy + 15} fontSize="8" fill="rgba(74,222,128,0.6)"  textAnchor="middle">Greed</text>
      </svg>
      <p className="text-sm font-medium mt-1" style={{ color }}>{label}</p>
      <p className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.3)" }}>Fear & Greed Index</p>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
function fmt(v: number, decimals = 2) {
  return v.toFixed(decimals);
}
function fmtChg(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

function sectorColor(changePercent: number) {
  if (changePercent >= 1.5)  return { bg: "rgba(74,222,128,0.2)",  text: "#4ade80",  border: "rgba(74,222,128,0.3)" };
  if (changePercent >= 0.5)  return { bg: "rgba(74,222,128,0.1)",  text: "#86efac",  border: "rgba(74,222,128,0.15)" };
  if (changePercent >= 0)    return { bg: "rgba(74,222,128,0.05)", text: "#bbf7d0",  border: "rgba(74,222,128,0.08)" };
  if (changePercent >= -0.5) return { bg: "rgba(248,113,113,0.05)",text: "#fca5a5",  border: "rgba(248,113,113,0.08)" };
  if (changePercent >= -1)   return { bg: "rgba(248,113,113,0.1)", text: "#f87171",  border: "rgba(248,113,113,0.15)" };
  return                            { bg: "rgba(248,113,113,0.2)",  text: "#ef4444",  border: "rgba(248,113,113,0.3)" };
}

// ── Static config ─────────────────────────────────────────────────
const SECTORS = [
  { name: "Tech",        ticker: "XLK"  },
  { name: "Comm. Svcs",  ticker: "XLC"  },
  { name: "Consumer D.", ticker: "XLY"  },
  { name: "Industrials", ticker: "XLI"  },
  { name: "Financials",  ticker: "XLF"  },
  { name: "Health Care", ticker: "XLV"  },
  { name: "Real Estate", ticker: "XLRE" },
  { name: "Materials",   ticker: "XLB"  },
  { name: "Utilities",   ticker: "XLU"  },
  { name: "Cons. Stap.", ticker: "XLP"  },
  { name: "Energy",      ticker: "XLE"  },
];

const TRENDING_SYMBOLS = ["NVDA", "SPY", "TSLA", "AAPL", "QQQ", "^VIX"];
const TRENDING_LABELS: Record<string, string> = { "^VIX": "VIX" };

const smartMoney = [
  { label: "Institutional Buying", value: 72, color: "#4ade80" },
  { label: "Retail Sentiment",     value: 61, color: "#C9A96E" },
  { label: "Options Bullishness",  value: 68, color: "#93c5fd" },
  { label: "Dark Pool Activity",   value: 54, color: "#C9A96E" },
];

// ── Component ─────────────────────────────────────────────────────
export default function SentimentDashboard({ initialData }: { initialData?: MarketData | null }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [data, setData] = useState<MarketData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/market-data");
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    }
    // Skip immediate fetch if we already have SSR data; poll starts after 60s
    if (!initialData) load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quotes = data?.quotes ?? {};
  const fg = data?.fearGreed;
  const fgScore = fg?.score ?? 62;
  const vix = quotes["^VIX"];

  // Build indicator rows — VIX is live, others are indicative
  const indicators = [
    {
      label: "VIX",
      value: vix ? fmt(vix.price) : "—",
      sub: vix ? (vix.changePercent < 0 ? "Volatility declining" : "Volatility rising") : "Loading…",
      delta: vix ? fmtChg(vix.changePercent) : "—",
      up: vix ? vix.changePercent > 0 : false,
    },
    { label: "Put/Call Ratio", value: "0.72",  sub: "Bullish lean",         delta: "-0.08", up: false },
    { label: "Adv / Dec",      value: "2.4:1", sub: "Strong breadth",       delta: "+0.3",  up: true  },
    { label: "High/Low Ratio", value: "78%",   sub: "New highs dominating", delta: "+5%",   up: true  },
    { label: "% Above 200MA",  value: "67%",   sub: "Majority in uptrend",  delta: "+2%",   up: true  },
    { label: "Safe Haven Dem.",value: "Low",   sub: "TLT & GLD soft",       delta: "—",     up: false },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Row 1 — Gauge + Indicators */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Fear & Greed */}
        <div
          className="flex flex-col items-center justify-center py-8 rounded-sm"
          style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(8,13,26,0.6)" }}
        >
          <FearGreedGauge score={fgScore} />
          <div className="mt-6 flex gap-8 text-center">
            {[
              { label: "Yesterday",   value: String(fg?.previousClose ?? "—") },
              { label: "Last Week",   value: String(fg?.previousWeek  ?? "—") },
              { label: "Last Month",  value: String(fg?.previousMonth ?? "—") },
            ].map((h) => (
              <div key={h.label}>
                <p className="text-lg font-light" style={{ color: "#E8D5A3" }}>{h.value}</p>
                <p className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.3)" }}>{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key indicators */}
        <div className="grid grid-cols-2 gap-3">
          {indicators.map((ind) => (
            <div
              key={ind.label}
              className="rounded-sm px-4 py-4"
              style={{ border: "1px solid rgba(201,169,110,0.08)", background: "rgba(8,13,26,0.6)" }}
            >
              <p className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(201,169,110,0.4)" }}>{ind.label}</p>
              <p className="text-xl font-light mb-0.5" style={{ color: "#E8D5A3" }}>{ind.value}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: ind.up ? "#4ade80" : "#f87171" }}>{ind.delta}</span>
                <span className="text-[9px]" style={{ color: "rgba(240,234,216,0.25)" }}>{ind.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — Sector Heatmap */}
      <div
        className="rounded-sm p-5"
        style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(8,13,26,0.6)" }}
      >
        <p className="mb-4 text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.4)" }}>
          Sector Performance — Today
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
          {SECTORS.map((s) => {
            const q = quotes[s.ticker];
            const pct = q?.changePercent ?? 0;
            const c = sectorColor(pct);
            const isHov = hovered === s.ticker;
            const label = loading ? "…" : (q ? fmtChg(pct) : "—");
            return (
              <div
                key={s.ticker}
                onMouseEnter={() => setHovered(s.ticker)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center justify-center rounded-sm py-3 px-1 cursor-default transition-all duration-200"
                style={{
                  background: c.bg,
                  border: `1px solid ${isHov ? c.text : c.border}`,
                  transform: isHov ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="text-[9px] font-semibold" style={{ color: c.text }}>{label}</span>
                <span className="text-[8px] mt-0.5 text-center leading-tight" style={{ color: "rgba(240,234,216,0.5)" }}>{s.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3 — Trending + Smart Money */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Trending tickers */}
        <div
          className="rounded-sm p-5"
          style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(8,13,26,0.6)" }}
        >
          <p className="mb-4 text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.4)" }}>
            Trending Tickers
          </p>
          <div className="flex flex-col gap-2.5">
            {TRENDING_SYMBOLS.map((sym) => {
              const q = quotes[sym];
              const pct = q?.changePercent ?? 0;
              const label = TRENDING_LABELS[sym] ?? sym;
              const isBullish = pct >= 0;
              const dotColor = isBullish ? "#4ade80" : "#f87171";
              return (
                <div key={sym} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: dotColor }} />
                    <span className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{label}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: dotColor }}>
                    {loading ? "…" : (q ? fmtChg(pct) : "—")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart money bars */}
        <div
          className="rounded-sm p-5"
          style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(8,13,26,0.6)" }}
        >
          <p className="mb-4 text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.4)" }}>
            Smart Money Positioning
          </p>
          <div className="flex flex-col gap-4">
            {smartMoney.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs" style={{ color: "rgba(240,234,216,0.5)" }}>{m.label}</span>
                  <span className="text-xs font-medium" style={{ color: m.color }}>{m.value}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(240,234,216,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.value}%`, background: m.color, opacity: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timestamp */}
      {data && (
        <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
          Live data · VIX, sectors, and F&G updated · refreshes every 60s
        </p>
      )}
    </div>
  );
}
