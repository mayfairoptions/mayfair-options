"use client";

import { useEffect, useState } from "react";
import type { FlowItem } from "@/app/api/options-flow/route";

type Filter = "All" | "Bullish" | "Bearish";

function fmtPremium(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#4ade80" }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#4ade80" }} />
    </span>
  );
}

type FlowData = { flow: FlowItem[]; callPremium: number; putPremium: number; ts: number };

export default function OptionsFlow({ initialData }: { initialData?: FlowData | null }) {
  const [filter, setFilter]   = useState<Filter>("All");
  const [flow, setFlow]       = useState<FlowItem[]>(initialData?.flow ?? []);
  const [callPrem, setCallPrem] = useState(initialData?.callPremium ?? 0);
  const [putPrem, setPutPrem]   = useState(initialData?.putPremium ?? 0);
  const [loading, setLoading] = useState(!initialData);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(initialData ? new Date(initialData.ts) : null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/options-flow");
        if (res.ok) {
          const data = await res.json();
          setFlow(data.flow ?? []);
          setCallPrem(data.callPremium ?? 0);
          setPutPrem(data.putPremium ?? 0);
          setLastUpdate(new Date(data.ts));
        }
      } finally {
        setLoading(false);
      }
    }
    if (!initialData) load();
    const id = setInterval(load, 2 * 60_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = filter === "All" ? flow : flow.filter((f) => f.sentiment === filter);
  const totalPrem = callPrem + putPrem;
  const callPct = totalPrem > 0 ? Math.round((callPrem / totalPrem) * 100) : 50;

  return (
    <div className="flex flex-col gap-5">

      {/* Premium ratio bar */}
      <div
        className="rounded-sm p-4"
        style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(8,13,26,0.6)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
              Premium Flow
            </p>
            {!loading && <PulsingDot />}
          </div>
          {lastUpdate && (
            <span className="text-[9px]" style={{ color: "rgba(240,234,216,0.2)" }}>
              {lastUpdate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs w-20 text-right" style={{ color: "#4ade80" }}>
            {loading ? "…" : `${fmtPremium(callPrem)} calls`}
          </span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(248,113,113,0.25)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${callPct}%`, background: "#4ade80", opacity: 0.85 }}
            />
          </div>
          <span className="text-xs w-20" style={{ color: "#f87171" }}>
            {loading ? "…" : `${fmtPremium(putPrem)} puts`}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px]" style={{ color: "rgba(74,222,128,0.5)" }}>{callPct}% bullish</span>
          <span className="text-[9px]" style={{ color: "rgba(248,113,113,0.5)" }}>{100 - callPct}% bearish</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 items-center">
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
        <span className="ml-auto text-[10px]" style={{ color: "rgba(240,234,216,0.25)" }}>
          {loading ? "Loading…" : `${visible.length} contracts`}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm" style={{ border: "1px solid rgba(201,169,110,0.1)" }}>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.03)" }}>
              {["Time", "Ticker", "Type", "Strike", "Expiry", "Premium", "Volume", "OI", "IV", "Sentiment"].map((h) => (
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
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(240,234,216,0.04)" }}>
                  {[...Array(10)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 rounded animate-pulse" style={{ background: "rgba(240,234,216,0.06)", width: j === 0 ? 32 : j === 5 ? 48 : 56 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-xs" style={{ color: "rgba(240,234,216,0.25)" }}>
                  No significant flow detected. Markets may be closed.
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr
                  key={`${row.ticker}-${row.strike}-${row.expiry}-${i}`}
                  style={{
                    borderBottom: "1px solid rgba(240,234,216,0.04)",
                    background: i % 2 === 0 ? "transparent" : "rgba(240,234,216,0.01)",
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {row.isNew && <PulsingDot />}
                      <span style={{ color: "rgba(240,234,216,0.35)" }}>{row.time}</span>
                    </div>
                  </td>
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span style={{ color: "rgba(240,234,216,0.6)" }}>{row.strike}</span>
                    {row.itm && (
                      <span className="ml-1.5 text-[8px] tracking-widest uppercase" style={{ color: "rgba(201,169,110,0.4)" }}>ITM</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.6)" }}>{row.expiry}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium" style={{ color: "#C9A96E" }}>{row.premium}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.6)" }}>{row.volume}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.4)" }}>{row.oi}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(240,234,216,0.5)" }}>{row.iv}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span style={{ color: row.sentiment === "Bullish" ? "#4ade80" : "#f87171" }}>
                      {row.sentiment === "Bullish" ? "▲ " : "▼ "}
                      {row.sentiment}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
        Live · High-volume options scanner · Sorted by dollar premium · Refreshes every 2 min
      </p>
    </div>
  );
}
