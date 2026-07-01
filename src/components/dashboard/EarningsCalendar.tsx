"use client";

import { useEffect, useState } from "react";
import type { CalendarData, EarningItem, EconEvent } from "@/app/api/calendar/route";

type Tab  = "earnings" | "economic";
type Week = "this" | "next";

const DAYS = ["Mon","Tue","Wed","Thu","Fri"];

const impactStyle = {
  High:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", label: "High" },
  Medium: { color: "#C9A96E", bg: "rgba(201,169,110,0.08)", border: "rgba(201,169,110,0.25)", label: "Med"  },
  Low:    { color: "rgba(240,234,216,0.3)", bg: "rgba(240,234,216,0.04)", border: "rgba(240,234,216,0.1)", label: "Low" },
  high:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", label: "High" },
  medium: { color: "#C9A96E", bg: "rgba(201,169,110,0.08)", border: "rgba(201,169,110,0.25)", label: "Med"  },
  low:    { color: "rgba(240,234,216,0.3)", bg: "rgba(240,234,216,0.04)", border: "rgba(240,234,216,0.1)", label: "Low" },
};

const timeStyle = {
  BMO: { color: "#93c5fd", label: "Pre-Market" },
  AMC: { color: "#C9A96E",  label: "After Close" },
  TBD: { color: "rgba(240,234,216,0.3)", label: "TBD" },
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-sm px-4 py-3 animate-pulse" style={{ background: "rgba(8,13,26,0.6)", border: "1px solid rgba(201,169,110,0.08)" }}>
      <div className="h-9 w-9 rounded-sm shrink-0" style={{ background: "rgba(201,169,110,0.08)" }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 rounded w-24" style={{ background: "rgba(240,234,216,0.06)" }} />
        <div className="h-2.5 rounded w-16" style={{ background: "rgba(240,234,216,0.04)" }} />
      </div>
      <div className="h-5 w-12 rounded" style={{ background: "rgba(240,234,216,0.04)" }} />
    </div>
  );
}

export default function EarningsCalendar() {
  const [tab,     setTab]     = useState<Tab>("earnings");
  const [week,    setWeek]    = useState<Week>("this");
  const [data,    setData]    = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/calendar");
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 15 * 60_000);
    return () => clearInterval(id);
  }, []);

  const earnings: EarningItem[] = week === "this"
    ? (data?.earnings.thisWeek ?? [])
    : (data?.earnings.nextWeek ?? []);

  const econ: EconEvent[] = week === "this"
    ? (data?.econ.thisWeek ?? [])
    : (data?.econ.nextWeek ?? []);

  const nextEconAvailable = data?.econ.nextWeekAvailable ?? false;

  return (
    <div className="flex flex-col gap-5">
      {/* Tab + Week controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-sm p-1" style={{ background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.1)" }}>
          {([
            { key: "earnings", label: "Earnings" },
            { key: "economic", label: "Economic Events" },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: tab === t.key ? "rgba(201,169,110,0.12)" : "transparent",
                color:      tab === t.key ? "#C9A96E" : "rgba(240,234,216,0.35)",
                border:     tab === t.key ? "1px solid rgba(201,169,110,0.25)" : "1px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-sm p-1" style={{ background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.1)" }}>
          {([
            { key: "this", label: "This Week" },
            { key: "next", label: "Next Week" },
          ] as { key: Week; label: string }[]).map((w) => (
            <button
              key={w.key}
              onClick={() => setWeek(w.key)}
              className="px-4 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: week === w.key ? "rgba(201,169,110,0.12)" : "transparent",
                color:      week === w.key ? "#C9A96E" : "rgba(240,234,216,0.35)",
                border:     week === w.key ? "1px solid rgba(201,169,110,0.25)" : "1px solid transparent",
              }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Earnings tab ── */}
      {tab === "earnings" && (
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : earnings.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "rgba(240,234,216,0.25)" }}>
              No major earnings scheduled for {week === "this" ? "this" : "next"} week.
            </p>
          ) : (
            DAYS.map((day) => {
              const rows = earnings.filter((e) => e.dayLabel === day);
              if (!rows.length) return null;
              return (
                <div key={day}>
                  <p className="mb-3 text-[9px] tracking-[0.25em] uppercase px-1" style={{ color: "rgba(201,169,110,0.45)" }}>
                    {day} · {new Date(rows[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <div className="flex flex-col gap-2">
                    {rows.map((e) => {
                      const imp = impactStyle[e.importance];
                      const t   = timeStyle[e.time];
                      return (
                        <div
                          key={e.ticker}
                          className="flex items-center justify-between gap-4 rounded-sm px-4 py-3"
                          style={{ background: "rgba(8,13,26,0.6)", border: "1px solid rgba(201,169,110,0.08)" }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold"
                              style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", color: "#C9A96E" }}
                            >
                              {e.ticker.slice(0, 4)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: "#E8D5A3" }}>{e.ticker}</p>
                              <p className="text-[10px] truncate" style={{ color: "rgba(240,234,216,0.35)" }}>{e.company}</p>
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center gap-6 text-xs">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(240,234,216,0.25)" }}>EPS Est.</p>
                              <p style={{ color: "rgba(240,234,216,0.7)" }}>{e.epsEst}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(240,234,216,0.25)" }}>Rev Est.</p>
                              <p style={{ color: "rgba(240,234,216,0.7)" }}>{e.revEst}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] tracking-wide hidden sm:inline" style={{ color: t.color }}>{t.label}</span>
                            <span
                              className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                              style={{ background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color }}
                            >
                              {imp.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Economic events tab ── */}
      {tab === "economic" && (
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : week === "next" && !nextEconAvailable ? (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: "rgba(240,234,216,0.35)" }}>Next week&apos;s economic calendar isn&apos;t published yet.</p>
              <p className="text-xs mt-1" style={{ color: "rgba(240,234,216,0.2)" }}>Forex Factory typically releases it Sunday evening.</p>
            </div>
          ) : econ.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "rgba(240,234,216,0.25)" }}>No USD events found.</p>
          ) : (
            DAYS.map((day) => {
              const rows = econ.filter((e) => e.dayLabel === day);
              if (!rows.length) return null;
              return (
                <div key={day}>
                  <p className="mb-3 text-[9px] tracking-[0.25em] uppercase px-1" style={{ color: "rgba(201,169,110,0.45)" }}>
                    {day} · {new Date(rows[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <div className="flex flex-col gap-2">
                    {rows.map((e, i) => {
                      const imp = impactStyle[e.impact];
                      return (
                        <div
                          key={i}
                          className="rounded-sm px-4 py-3"
                          style={{
                            background: "rgba(8,13,26,0.6)",
                            border: `1px solid ${e.impact === "High" ? "rgba(248,113,113,0.12)" : "rgba(201,169,110,0.08)"}`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <span
                                className="shrink-0 mt-1.5 h-2 w-2 rounded-full"
                                style={{ background: imp.color }}
                              />
                              <div>
                                <p className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{e.title}</p>
                                <p className="text-[10px] mt-0.5" style={{ color: "rgba(240,234,216,0.3)" }}>US · {e.timeEt} ET</p>
                              </div>
                            </div>
                            <span
                              className="shrink-0 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                              style={{ background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color }}
                            >
                              {imp.label}
                            </span>
                          </div>

                          {(e.previous !== "—" || e.forecast !== "—") && (
                            <div className="flex gap-6 mt-3 pt-3 text-xs" style={{ borderTop: "1px solid rgba(240,234,216,0.05)" }}>
                              <div>
                                <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(240,234,216,0.25)" }}>Previous</p>
                                <p style={{ color: "rgba(240,234,216,0.6)" }}>{e.previous}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(240,234,216,0.25)" }}>Forecast</p>
                                <p style={{ color: "rgba(240,234,216,0.6)" }}>{e.forecast}</p>
                              </div>
                              {e.actual && (
                                <div>
                                  <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(240,234,216,0.25)" }}>Actual</p>
                                  <p style={{ color: "#4ade80", fontWeight: 500 }}>{e.actual}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {!loading && (
        <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
          Live · Earnings from Yahoo Finance · Economic events from Forex Factory · Refreshes every 15 min
        </p>
      )}
    </div>
  );
}
