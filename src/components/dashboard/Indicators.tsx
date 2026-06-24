"use client";

import { useState } from "react";

type Indicator = {
  id: string;
  name: string;
  version: string;
  category: "Momentum" | "Trend" | "Volatility" | "Volume";
  description: string;
  features: string[];
  tvUrl: string;
};

const INDICATORS: Indicator[] = [
  {
    id: "mo-flow",
    name: "Mayfair Options Flow",
    version: "v2.3",
    category: "Volume",
    description: "Tracks real-time options flow sentiment on the chart. Overlays directional bias markers based on call/put volume ratios.",
    features: ["Call/Put ratio overlay", "Volume-weighted signals", "Sentiment colour zones", "Configurable thresholds"],
    tvUrl: "https://www.tradingview.com/chart/",
  },
  {
    id: "mo-momentum",
    name: "Mayfair Momentum Ribbon",
    version: "v1.8",
    category: "Momentum",
    description: "Multi-timeframe momentum ribbon combining EMA crossovers with RSI divergence alerts for high-probability entry signals.",
    features: ["8/21/55 EMA ribbon", "RSI divergence detection", "Entry signal arrows", "Multi-timeframe alignment"],
    tvUrl: "https://www.tradingview.com/chart/",
  },
  {
    id: "mo-vwap",
    name: "Mayfair VWAP Suite",
    version: "v3.1",
    category: "Trend",
    description: "Institutional VWAP with dynamic standard deviation bands. Identifies premium/discount zones for optimal options entry.",
    features: ["Anchored VWAP", "1–3σ deviation bands", "Premium & discount zones", "Session reset toggle"],
    tvUrl: "https://www.tradingview.com/chart/",
  },
  {
    id: "mo-vol",
    name: "Mayfair Volatility Bands",
    version: "v1.4",
    category: "Volatility",
    description: "IV-adjusted Bollinger Bands that widen and contract with implied volatility. Essential for timing spreads and iron condors.",
    features: ["IV-adjusted width", "Squeeze detection", "Breakout alerts", "Historical vs IV comparison"],
    tvUrl: "https://www.tradingview.com/chart/",
  },
  {
    id: "mo-sweep",
    name: "Mayfair Sweep Detector",
    version: "v2.0",
    category: "Volume",
    description: "Detects unusual price sweeps and block prints on the tape. Flags potential institutional accumulation and distribution zones.",
    features: ["Block print detection", "Sweep highlighting", "Volume anomaly alerts", "Configurable sensitivity"],
    tvUrl: "https://www.tradingview.com/chart/",
  },
  {
    id: "mo-regime",
    name: "Mayfair Market Regime",
    version: "v1.1",
    category: "Trend",
    description: "Classifies the current market regime (trending, ranging, volatile) and adjusts strategy recommendations accordingly.",
    features: ["Regime classification", "Strategy overlay", "Trend strength score", "Choppiness index"],
    tvUrl: "https://www.tradingview.com/chart/",
  },
];

const categoryColor: Record<string, { bg: string; text: string; border: string }> = {
  Momentum:   { bg: "rgba(201,169,110,0.1)",  text: "#C9A96E",  border: "rgba(201,169,110,0.3)" },
  Trend:      { bg: "rgba(74,222,128,0.08)",  text: "#4ade80",  border: "rgba(74,222,128,0.25)" },
  Volatility: { bg: "rgba(248,113,113,0.08)", text: "#f87171",  border: "rgba(248,113,113,0.25)" },
  Volume:     { bg: "rgba(147,197,253,0.08)", text: "#93c5fd",  border: "rgba(147,197,253,0.25)" },
};

export default function Indicators() {
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-sm px-5 py-4 text-sm"
        style={{ background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.12)", color: "rgba(240,234,216,0.5)", fontWeight: 300 }}
      >
        Click <span style={{ color: "#C9A96E" }}>Open in TradingView</span> to load the indicator directly onto your chart. You must be logged into TradingView for the link to work.
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {INDICATORS.map((ind) => {
          const cat = categoryColor[ind.category];
          return (
            <div
              key={ind.id}
              className="flex flex-col gap-4 rounded-sm p-5"
              style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(8,13,26,0.6)" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{ind.name}</h3>
                    <span className="text-[9px]" style={{ color: "rgba(240,234,216,0.25)" }}>{ind.version}</span>
                  </div>
                  <span
                    className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                    style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
                  >
                    {ind.category}
                  </span>
                </div>
                {/* TV logo */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
                  style={{ background: "rgba(32,151,244,0.1)", border: "1px solid rgba(32,151,244,0.2)" }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#2097f4">
                    <path d="M4 4h16v16H4z" fillOpacity={0} />
                    <path d="M3 3h18v5H3zM3 10h4v11H3zM9 10h6v5H9zM9 17h6v4H9zM17 10h4v11h-4z" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
                {ind.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-1">
                {ind.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(240,234,216,0.35)" }}>
                    <span style={{ color: "#C9A96E" }}>·</span>
                    {f}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: "1px solid rgba(240,234,216,0.06)" }}>
                <a
                  href={ind.tvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-sm text-xs tracking-widest uppercase text-center font-medium transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
                >
                  Open in TradingView
                </a>
                <button
                  onClick={() => handleCopy(ind.id, ind.tvUrl)}
                  className="px-3 py-2 rounded-sm text-xs transition-all duration-200"
                  style={{ border: "1px solid rgba(201,169,110,0.2)", color: copied === ind.id ? "#4ade80" : "rgba(201,169,110,0.5)" }}
                  title="Copy link"
                >
                  {copied === ind.id ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
