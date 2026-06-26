"use client";

import { useState } from "react";

// ── Fear & Greed gauge ───────────────────────────────────────────
const SCORE = 62; // 0–100

function FearGreedGauge({ score }: { score: number }) {
  const label =
    score <= 25 ? "Extreme Fear" :
    score <= 45 ? "Fear" :
    score <= 55 ? "Neutral" :
    score <= 75 ? "Greed" : "Extreme Greed";

  const color =
    score <= 25 ? "#f87171" :
    score <= 45 ? "#fb923c" :
    score <= 55 ? "#C9A96E" :
    score <= 75 ? "#86efac" : "#4ade80";

  // SVG arc — 180° half-circle
  const R = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = -180;
  const sweepAngle = 180;
  const needleAngle = -180 + (score / 100) * 180;

  function polar(angle: number, r = R) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const trackStart = polar(startAngle);
  const trackEnd  = polar(startAngle + sweepAngle);
  const fillEnd   = polar(needleAngle);
  const needle    = polar(needleAngle, R - 4);

  const trackPath = `M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 0 1 ${trackEnd.x} ${trackEnd.y}`;
  const fillPath  = `M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 ${score > 50 ? 1 : 0} 1 ${fillEnd.x} ${fillEnd.y}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="20 20 160 90" className="w-56">
        {/* Track */}
        <path d={trackPath} fill="none" stroke="rgba(240,234,216,0.06)" strokeWidth="14" strokeLinecap="round" />
        {/* Coloured fill */}
        <path d={fillPath}  fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.85" />
        {/* Needle dot */}
        <circle cx={needle.x} cy={needle.y} r="5" fill={color} />
        {/* Score */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="28" fontWeight="300" fill="#F0EAD8">{score}</text>
        {/* Zone labels */}
        <text x="26" y="106" fontSize="7" fill="rgba(248,113,113,0.5)" textAnchor="middle">Fear</text>
        <text x="174" y="106" fontSize="7" fill="rgba(74,222,128,0.5)" textAnchor="middle">Greed</text>
      </svg>
      <p className="text-sm font-medium -mt-2" style={{ color }}>{label}</p>
      <p className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.3)" }}>Fear & Greed Index</p>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────
const indicators = [
  { label: "VIX",            value: "13.82",  sub: "Low volatility",        delta: "-4.2%",  up: false },
  { label: "Put/Call Ratio", value: "0.72",   sub: "Bullish lean",          delta: "-0.08",  up: false },
  { label: "Adv / Dec",      value: "2.4:1",  sub: "Strong breadth",        delta: "+0.3",   up: true  },
  { label: "High/Low Ratio", value: "78%",    sub: "New highs dominating",  delta: "+5%",    up: true  },
  { label: "% Above 200MA",  value: "67%",    sub: "Majority in uptrend",   delta: "+2%",    up: true  },
  { label: "Safe Haven Dem.",value: "Low",    sub: "TLT & GLD underperform",delta: "—",      up: false },
];

const sectors = [
  { name: "Tech",        ticker: "XLK",  change: "+1.82%" },
  { name: "Comm. Svcs",  ticker: "XLC",  change: "+1.41%" },
  { name: "Consumer D.", ticker: "XLY",  change: "+0.93%" },
  { name: "Industrials", ticker: "XLI",  change: "+0.71%" },
  { name: "Financials",  ticker: "XLF",  change: "+0.55%" },
  { name: "Health Care", ticker: "XLV",  change: "+0.22%" },
  { name: "Real Estate", ticker: "XLRE", change: "-0.14%" },
  { name: "Materials",   ticker: "XLB",  change: "-0.38%" },
  { name: "Utilities",   ticker: "XLU",  change: "-0.61%" },
  { name: "Cons. Stap.", ticker: "XLP",  change: "-0.74%" },
  { name: "Energy",      ticker: "XLE",  change: "-1.20%" },
];

const trending = [
  { ticker: "NVDA", sentiment: "bullish", mentions: "4.2K", change: "+2.3%" },
  { ticker: "SPY",  sentiment: "bullish", mentions: "3.8K", change: "+0.8%" },
  { ticker: "TSLA", sentiment: "bearish", mentions: "3.1K", change: "-1.4%" },
  { ticker: "AAPL", sentiment: "bullish", mentions: "2.7K", change: "+0.4%" },
  { ticker: "QQQ",  sentiment: "bullish", mentions: "2.4K", change: "+1.1%" },
  { ticker: "VIX",  sentiment: "bearish", mentions: "1.9K", change: "-4.2%" },
];

const smartMoney = [
  { label: "Institutional Buying", value: 72, color: "#4ade80" },
  { label: "Retail Sentiment",     value: 61, color: "#C9A96E" },
  { label: "Options Bullishness",  value: 68, color: "#93c5fd" },
  { label: "Dark Pool Activity",   value: 54, color: "#C9A96E" },
];

function sectorColor(change: string) {
  const v = parseFloat(change);
  if (v >= 1.5)  return { bg: "rgba(74,222,128,0.2)",  text: "#4ade80",  border: "rgba(74,222,128,0.3)" };
  if (v >= 0.5)  return { bg: "rgba(74,222,128,0.1)",  text: "#86efac",  border: "rgba(74,222,128,0.15)" };
  if (v >= 0)    return { bg: "rgba(74,222,128,0.05)", text: "#bbf7d0",  border: "rgba(74,222,128,0.08)" };
  if (v >= -0.5) return { bg: "rgba(248,113,113,0.05)",text: "#fca5a5",  border: "rgba(248,113,113,0.08)" };
  if (v >= -1)   return { bg: "rgba(248,113,113,0.1)", text: "#f87171",  border: "rgba(248,113,113,0.15)" };
  return               { bg: "rgba(248,113,113,0.2)",  text: "#ef4444",  border: "rgba(248,113,113,0.3)" };
}

const sentimentDot = {
  bullish: "#4ade80",
  bearish: "#f87171",
  neutral: "#C9A96E",
};

export default function SentimentDashboard() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">

      {/* Row 1 — Gauge + Indicators */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Fear & Greed */}
        <div
          className="flex flex-col items-center justify-center py-8 rounded-sm"
          style={{ border: "1px solid rgba(201,169,110,0.12)", background: "rgba(8,13,26,0.6)" }}
        >
          <FearGreedGauge score={SCORE} />
          <div className="mt-6 flex gap-8 text-center">
            {[
              { label: "Yesterday", value: "58" },
              { label: "Last Week", value: "51" },
              { label: "Last Month", value: "44" },
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
          {sectors.map((s) => {
            const c = sectorColor(s.change);
            const isHov = hovered === s.ticker;
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
                <span className="text-[9px] font-semibold" style={{ color: c.text }}>{s.change}</span>
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
            {trending.map((t) => (
              <div key={t.ticker} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: sentimentDot[t.sentiment as keyof typeof sentimentDot] }}
                  />
                  <span className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{t.ticker}</span>
                  <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.25)" }}>{t.mentions} mentions</span>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: t.change.startsWith("+") ? "#4ade80" : "#f87171" }}
                >
                  {t.change}
                </span>
              </div>
            ))}
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

      <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
        Sample data — wire to CNN Fear & Greed API, CBOE, and market data provider for live readings
      </p>
    </div>
  );
}
