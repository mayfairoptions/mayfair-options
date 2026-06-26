"use client";

import { useState } from "react";

type Earning = {
  ticker: string;
  company: string;
  date: string; // "Mon", "Tue", etc.
  time: "BMO" | "AMC" | "TBD"; // Before Market Open / After Market Close
  epsEst: string;
  epsActual?: string;
  revEst: string;
  revActual?: string;
  importance: "high" | "medium" | "low";
};

type EconEvent = {
  name: string;
  date: string;
  time: string;
  previous: string;
  forecast: string;
  actual?: string;
  impact: "high" | "medium" | "low";
  country: string;
};

const THIS_WEEK_EARNINGS: Earning[] = [
  { ticker: "NKE",  company: "Nike",              date: "Mon", time: "AMC", epsEst: "$0.29", revEst: "$11.8B", importance: "medium" },
  { ticker: "MU",   company: "Micron Technology",  date: "Tue", time: "AMC", epsEst: "$1.48", revEst: "$8.9B",  importance: "high" },
  { ticker: "WBA",  company: "Walgreens Boots",    date: "Tue", time: "BMO", epsEst: "$0.38", revEst: "$37.2B", importance: "medium" },
  { ticker: "PAYX", company: "Paychex",             date: "Wed", time: "BMO", epsEst: "$1.25", revEst: "$1.4B",  importance: "low" },
  { ticker: "STZ",  company: "Constellation Brands",date: "Wed", time: "BMO", epsEst: "$2.99", revEst: "$2.5B",  importance: "medium" },
  { ticker: "LEVI", company: "Levi Strauss",        date: "Thu", time: "AMC", epsEst: "$0.14", revEst: "$1.4B",  importance: "low" },
  { ticker: "CAG",  company: "Conagra Brands",      date: "Fri", time: "BMO", epsEst: "$0.58", revEst: "$2.8B",  importance: "low" },
];

const NEXT_WEEK_EARNINGS: Earning[] = [
  { ticker: "TSLA", company: "Tesla",               date: "Mon", time: "AMC", epsEst: "$0.51", revEst: "$22.1B", importance: "high" },
  { ticker: "GOOGL",company: "Alphabet",             date: "Tue", time: "AMC", epsEst: "$2.01", revEst: "$89.3B", importance: "high" },
  { ticker: "META", company: "Meta Platforms",       date: "Wed", time: "AMC", epsEst: "$5.25", revEst: "$42.3B", importance: "high" },
  { ticker: "MSFT", company: "Microsoft",            date: "Wed", time: "AMC", epsEst: "$3.10", revEst: "$68.4B", importance: "high" },
  { ticker: "AAPL", company: "Apple",                date: "Thu", time: "AMC", epsEst: "$1.43", revEst: "$94.5B", importance: "high" },
  { ticker: "AMZN", company: "Amazon",               date: "Thu", time: "AMC", epsEst: "$1.36", revEst: "$159B",  importance: "high" },
  { ticker: "NVDA", company: "Nvidia",               date: "Fri", time: "BMO", epsEst: "$0.74", revEst: "$43.2B", importance: "high" },
];

const THIS_WEEK_ECON: EconEvent[] = [
  { name: "S&P/CS HPI (MoM)",       date: "Mon", time: "09:00",  previous: "0.4%",  forecast: "0.3%",  country: "US",  impact: "medium" },
  { name: "CB Consumer Confidence",  date: "Tue", time: "10:00",  previous: "98.0",  forecast: "99.5",  country: "US",  impact: "high" },
  { name: "ADP Non-Farm Employment", date: "Wed", time: "08:15",  previous: "152K",  forecast: "140K",  country: "US",  impact: "high" },
  { name: "FOMC Meeting Minutes",    date: "Wed", time: "14:00",  previous: "—",     forecast: "—",     country: "US",  impact: "high" },
  { name: "Initial Jobless Claims",  date: "Thu", time: "08:30",  previous: "219K",  forecast: "215K",  country: "US",  impact: "medium" },
  { name: "PCE Price Index (MoM)",   date: "Thu", time: "08:30",  previous: "0.2%",  forecast: "0.2%",  country: "US",  impact: "high" },
  { name: "Non-Farm Payrolls",       date: "Fri", time: "08:30",  previous: "256K",  forecast: "180K",  country: "US",  impact: "high" },
  { name: "Unemployment Rate",       date: "Fri", time: "08:30",  previous: "4.1%",  forecast: "4.2%",  country: "US",  impact: "high" },
];

const NEXT_WEEK_ECON: EconEvent[] = [
  { name: "ISM Manufacturing PMI",   date: "Mon", time: "10:00", previous: "48.5",  forecast: "49.0",  country: "US", impact: "medium" },
  { name: "JOLTS Job Openings",      date: "Tue", time: "10:00", previous: "7.19M", forecast: "7.10M", country: "US", impact: "medium" },
  { name: "CPI (MoM)",               date: "Wed", time: "08:30", previous: "0.2%",  forecast: "0.2%",  country: "US", impact: "high" },
  { name: "CPI (YoY)",               date: "Wed", time: "08:30", previous: "2.4%",  forecast: "2.3%",  country: "US", impact: "high" },
  { name: "FOMC Rate Decision",      date: "Wed", time: "14:00", previous: "4.50%", forecast: "4.50%", country: "US", impact: "high" },
  { name: "Fed Press Conference",    date: "Wed", time: "14:30", previous: "—",     forecast: "—",     country: "US", impact: "high" },
  { name: "PPI (MoM)",               date: "Thu", time: "08:30", previous: "0.2%",  forecast: "0.2%",  country: "US", impact: "medium" },
  { name: "Michigan Sentiment",      date: "Fri", time: "10:00", previous: "50.8",  forecast: "51.5",  country: "US", impact: "medium" },
];

const impactStyle = {
  high:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", label: "High" },
  medium: { color: "#C9A96E", bg: "rgba(201,169,110,0.08)", border: "rgba(201,169,110,0.25)", label: "Med" },
  low:    { color: "rgba(240,234,216,0.3)", bg: "rgba(240,234,216,0.04)", border: "rgba(240,234,216,0.1)", label: "Low" },
};

const timeStyle = {
  BMO: { color: "#93c5fd", label: "Pre-Market" },
  AMC: { color: "#C9A96E", label: "After Close" },
  TBD: { color: "rgba(240,234,216,0.3)", label: "TBD" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type Tab = "earnings" | "economic";
type Week = "this" | "next";

export default function EarningsCalendar() {
  const [tab, setTab] = useState<Tab>("earnings");
  const [week, setWeek] = useState<Week>("this");

  const earnings = week === "this" ? THIS_WEEK_EARNINGS : NEXT_WEEK_EARNINGS;
  const econ = week === "this" ? THIS_WEEK_ECON : NEXT_WEEK_ECON;

  return (
    <div className="flex flex-col gap-5">
      {/* Tab + Week controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
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
                color: tab === t.key ? "#C9A96E" : "rgba(240,234,216,0.35)",
                border: tab === t.key ? "1px solid rgba(201,169,110,0.25)" : "1px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Week toggle */}
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
                color: week === w.key ? "#C9A96E" : "rgba(240,234,216,0.35)",
                border: week === w.key ? "1px solid rgba(201,169,110,0.25)" : "1px solid transparent",
              }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Earnings view ── */}
      {tab === "earnings" && (
        <div className="flex flex-col gap-6">
          {DAYS.map((day) => {
            const dayEarnings = earnings.filter((e) => e.date === day);
            if (dayEarnings.length === 0) return null;
            return (
              <div key={day}>
                <p className="mb-3 text-[9px] tracking-[0.25em] uppercase px-1" style={{ color: "rgba(201,169,110,0.45)" }}>
                  {day}
                </p>
                <div className="flex flex-col gap-2">
                  {dayEarnings.map((e) => {
                    const imp = impactStyle[e.importance];
                    const t = timeStyle[e.time];
                    return (
                      <div
                        key={e.ticker}
                        className="flex items-center justify-between gap-4 rounded-sm px-4 py-3"
                        style={{ background: "rgba(8,13,26,0.6)", border: "1px solid rgba(201,169,110,0.08)" }}
                      >
                        {/* Left */}
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

                        {/* Middle — hide on small phones */}
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

                        {/* Right */}
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
          })}
        </div>
      )}

      {/* ── Economic events view ── */}
      {tab === "economic" && (
        <div className="flex flex-col gap-6">
          {DAYS.map((day) => {
            const dayEvents = econ.filter((e) => e.date === day);
            if (dayEvents.length === 0) return null;
            return (
              <div key={day}>
                <p className="mb-3 text-[9px] tracking-[0.25em] uppercase px-1" style={{ color: "rgba(201,169,110,0.45)" }}>
                  {day}
                </p>
                <div className="flex flex-col gap-2">
                  {dayEvents.map((e, i) => {
                    const imp = impactStyle[e.impact];
                    return (
                      <div
                        key={i}
                        className="rounded-sm px-4 py-3"
                        style={{ background: "rgba(8,13,26,0.6)", border: `1px solid ${e.impact === "high" ? "rgba(248,113,113,0.12)" : "rgba(201,169,110,0.08)"}` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Event name + time */}
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className="shrink-0 mt-0.5 h-2 w-2 rounded-full"
                              style={{ background: imp.color, marginTop: "6px" }}
                            />
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{e.name}</p>
                              <p className="text-[10px] mt-0.5" style={{ color: "rgba(240,234,216,0.3)" }}>{e.country} · {e.time} ET</p>
                            </div>
                          </div>
                          {/* Impact badge */}
                          <span
                            className="shrink-0 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                            style={{ background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color }}
                          >
                            {imp.label}
                          </span>
                        </div>

                        {/* Data row */}
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
          })}
        </div>
      )}

      <p className="text-[10px] text-center" style={{ color: "rgba(240,234,216,0.2)" }}>
        Sample data — wire to Earnings Whispers, Financial Modeling Prep, or Tradier for live calendar
      </p>
    </div>
  );
}
