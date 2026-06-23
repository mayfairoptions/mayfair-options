"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TradingView: {
      widget: new (config: object) => object;
    };
  }
}

const POPULAR = ["NASDAQ:NVDA", "NASDAQ:AAPL", "NASDAQ:TSLA", "AMEX:SPY", "NASDAQ:QQQ", "NYSE:AMD"];

export default function TradingViewWidget() {
  const [symbol, setSymbol] = useState("NASDAQ:NVDA");
  const [input, setInput] = useState("");
  const widgetRef = useRef<object | null>(null);
  const containerId = "tv_chart_container";

  useEffect(() => {
    const existing = document.getElementById("tv-script");
    if (existing) {
      initWidget();
      return;
    }
    const script = document.createElement("script");
    script.id = "tv-script";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = initWidget;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (window.TradingView) initWidget();
  }, [symbol]);

  function initWidget() {
    const el = document.getElementById(containerId);
    if (!el || !window.TradingView) return;
    el.innerHTML = "";
    widgetRef.current = new window.TradingView.widget({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "America/New_York",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#080d1a",
      backgroundColor: "rgba(8,13,26,1)",
      gridColor: "rgba(201,169,110,0.06)",
      enable_publishing: false,
      allow_symbol_change: true,
      save_image: false,
      container_id: containerId,
      hide_side_toolbar: false,
      studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      setSymbol(input.trim().toUpperCase());
      setInput("");
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Search + quick symbols */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search ticker… e.g. AAPL"
            className="rounded-sm px-4 py-2 text-xs outline-none w-48"
            style={{
              background: "rgba(201,169,110,0.05)",
              border: "1px solid rgba(201,169,110,0.2)",
              color: "#E8D5A3",
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs tracking-widest uppercase rounded-sm transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
          >
            Go
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {POPULAR.map((s) => {
            const label = s.split(":")[1];
            return (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                className="px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-sm transition-all duration-200"
                style={{
                  border: `1px solid ${symbol === s ? "rgba(201,169,110,0.5)" : "rgba(201,169,110,0.15)"}`,
                  color: symbol === s ? "#C9A96E" : "rgba(240,234,216,0.4)",
                  background: symbol === s ? "rgba(201,169,110,0.08)" : "transparent",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div
        id={containerId}
        className="flex-1 rounded-sm overflow-hidden"
        style={{
          border: "1px solid rgba(201,169,110,0.12)",
          minHeight: "520px",
        }}
      />
    </div>
  );
}
