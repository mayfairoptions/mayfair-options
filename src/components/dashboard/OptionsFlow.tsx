"use client";

import { useState } from "react";

type Flow = {
  time: string;
  ticker: string;
  type: "Call" | "Put";
  strike: string;
  expiry: string;
  premium: string;
  volume: string;
  oi: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
};

const FLOW: Flow[] = [
  { time: "9:31",  ticker: "NVDA", type: "Call", strike: "$145C", expiry: "Jul 18", premium: "$2.4M", volume: "18,400", oi: "4,200",  sentiment: "Bullish" },
  { time: "9:34",  ticker: "SPY",  type: "Put",  strike: "$525P", expiry: "Jul 11", premium: "$1.8M", volume: "22,100", oi: "9,800",  sentiment: "Bearish" },
  { time: "9:41",  ticker: "TSLA", type: "Call", strike: "$260C", expiry: "Jul 25", premium: "$3.1M", volume: "11,500", oi: "2,900",  sentiment: "Bullish" },
  { time: "9:55",  ticker: "AAPL", type: "Call", strike: "$215C", expiry: "Aug 15", premium: "$5.6M", volume: "31,200", oi: "12,400", sentiment: "Bullish" },
  { time: "10:02", ticker: "AMD",  type: "Put",  strike: "$155P", expiry: "Jul 18", premium: "$0.9M", volume: "8,700",  oi: "3,100",  sentiment: "Bearish" },
  { time: "10:14", ticker: "QQQ",  type: "Call", strike: "$480C", expiry: "Jul 18", premium: "$4.2M", volume: "26,800", oi: "7,600",  sentiment: "Bullish" },
  { time: "10:28", ticker: "META", type: "Call", strike: "$550C", expiry: "Aug 15", premium: "$6.1M", volume: "14,300", oi: "3,800",  sentiment: "Bullish" },
  { time: "10:35", ticker: "VIX",  type: "Call", strike: "$18C",  expiry: "Jul 16", premium: "$1.2M", volume: "42,000", oi: "18,500", sentiment: "Bearish" },
  { time: "10:49", ticker: "MSFT", type: "Put",  strike: "$415P", expiry: "Jul 18", premium: "$2.7M", volume: "9,400",  oi: "4,200",  sentiment: "Bearish" },
  { time: "11:03", ticker: "GOOGL",type: "Call", strike: "$190C", expiry: "Aug 15", premium: "$3.8M", volume: "17,600", oi: "6,100",  sentiment: "Bullish" },
];

type Filter = "All" | "Bullish" | "Bearish";

export default function OptionsFlow() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = filter === "All" ? FLOW : FLOW.filter((f) => f.sentiment === filter);

  return (
    <div className="flex flex-col gap-5">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["All", "Bullish", "Bearish"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              background: filter === f
                ? f === "Bullish" ? "rgba(74,222,128,0.12)" : f === "Bearish" ? "rgba(248,113,113,0.12)" : "rgba(201,169,110,0.12)"
                : "transparent",
              border: `1px solid ${filter === f
                ? f === "Bullish" ? "rgba(74,222,128,0.35)" : f === "Bearish" ? "rgba(248,113,113,0.35)" : "rgba(201,169,110,0.35)"
                : "rgba(240,234,216,0.08)"}`,
              color: filter === f
                ? f === "Bullish" ? "#4ade80" : f === "Bearish" ? "#f87171" : "#C9A96E"
                : "rgba(240,234,216,0.3)",
            }}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[10px] self-center" style={{ color: "rgba(240,234,216,0.25)" }}>
          {visible.length} entries
        </span>
      </div>

      {/* Table — scroll on mobile */}
      <div className="overflow-x-auto rounded-sm" style={{ border: "1px solid rgba(201,169,110,0.1)" }}>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.03)" }}>
              {["Time", "Ticker", "Type", "Strike", "Expiry", "Premium", "Volume", "OI", "Sentiment"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[9px] tracking-[0.2em] uppercase font-medium whitespace-nowrap"
                  style={{ color: "rgba(201,169,110,0.5)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid rgba(240,234,216,0.04)",
                  background: i % 2 === 0 ? "transparent" : "rgba(240,234,216,0.01)",
                }}
              >
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.35)" }}>{row.time}</td>
                <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: "#E8D5A3" }}>{row.ticker}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className="px-2 py-0.5 rounded-sm text-[9px] tracking-widest uppercase"
                    style={{
                      background: row.type === "Call" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                      color: row.type === "Call" ? "#4ade80" : "#f87171",
                      border: `1px solid ${row.type === "Call" ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
                    }}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.6)" }}>{row.strike}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.6)" }}>{row.expiry}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium" style={{ color: "#C9A96E" }}>{row.premium}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.6)" }}>{row.volume}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.4)" }}>{row.oi}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className="px-2 py-0.5 rounded-sm text-[9px] tracking-widest uppercase"
                    style={{
                      color: row.sentiment === "Bullish" ? "#4ade80" : row.sentiment === "Bearish" ? "#f87171" : "rgba(240,234,216,0.4)",
                    }}
                  >
                    {row.sentiment === "Bullish" ? "▲ " : row.sentiment === "Bearish" ? "▼ " : ""}
                    {row.sentiment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
        Sample data — live flow requires an options data API (Unusual Whales, Tradier, etc.)
      </p>
    </div>
  );
}
