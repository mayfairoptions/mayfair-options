"use client";

import { useState } from "react";

const analysts = [
  { id: "marcus", name: "Marcus Reynolds", initials: "MR" },
  { id: "priya",  name: "Priya Sharma",    initials: "PS" },
  { id: "jordan", name: "Jordan Kane",     initials: "JK" },
  { id: "elena",  name: "Elena Vasquez",   initials: "EV" },
  { id: "daniel", name: "Daniel Frost",    initials: "DF" },
];

type Alert = {
  id: string;
  analystId: string;
  ticker: string;
  type: string;
  strike: string;
  expiry: string;
  entry: string;
  target: string;
  return: string;
  status: "open" | "closed" | "new";
  note: string;
  time: string;
};

const ALERTS: Alert[] = [
  { id: "1", analystId: "marcus", ticker: "NVDA", type: "Call Spread", strike: "140/145C", expiry: "Jul 18", entry: "$1.20", target: "$2.50", return: "+108%", status: "new",    note: "Breaking out of consolidation — strong volume confirmation.",  time: "8:42 AM" },
  { id: "2", analystId: "priya",  ticker: "SPY",  type: "Put Spread",  strike: "530/525P", expiry: "Jul 11", entry: "$0.95", target: "$1.90", return: "+100%", status: "open",   note: "Hedging CPI risk. Theta-friendly structure, tight spread.",      time: "9:05 AM" },
  { id: "3", analystId: "jordan", ticker: "TSLA", type: "Call",        strike: "260C",     expiry: "Jul 25", entry: "$3.40", target: "$7.00", return: "+105%", status: "open",   note: "Delivery event catalyst. Strong IV expansion expected.",         time: "9:18 AM" },
  { id: "4", analystId: "elena",  ticker: "AAPL", type: "Iron Condor", strike: "200/205/215/220", expiry: "Jul 18", entry: "$1.80", target: "$3.20", return: "+78%", status: "open", note: "Low vol environment. Range-bound into earnings.",           time: "9:31 AM" },
  { id: "5", analystId: "marcus", ticker: "AMD",  type: "Call Spread", strike: "165/170C", expiry: "Jul 18", entry: "$1.05", target: "$2.10", return: "+100%", status: "closed", note: "Target reached. Closed for full profit.",                        time: "Yesterday" },
  { id: "6", analystId: "daniel", ticker: "QQQ",  type: "Put",        strike: "470P",     expiry: "Jul 11", entry: "$2.10", target: "$4.50", return: "+114%", status: "closed", note: "CPI miss play — profit taken at open.",                          time: "Yesterday" },
];

const statusColor: Record<string, { bg: string; border: string; text: string; label: string }> = {
  new:    { bg: "rgba(201,169,110,0.12)", border: "rgba(201,169,110,0.4)", text: "#C9A96E",  label: "New" },
  open:   { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.3)",  text: "#4ade80",  label: "Open" },
  closed: { bg: "rgba(240,234,216,0.04)", border: "rgba(240,234,216,0.1)", text: "rgba(240,234,216,0.3)", label: "Closed" },
};

export default function AlertsFeed() {
  const [selected, setSelected] = useState<Set<string>>(new Set(analysts.map((a) => a.id)));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const visible = ALERTS.filter((a) => selected.has(a.analystId));

  return (
    <div className="flex flex-col gap-6">
      {/* Analyst filter */}
      <div
        className="rounded-sm p-4"
        style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.02)" }}
      >
        <p className="mb-3 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
          Filter by Analyst
        </p>
        <div className="flex flex-wrap gap-2">
          {analysts.map((a) => {
            const on = selected.has(a.id);
            return (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs transition-all duration-200"
                style={{
                  background: on ? "rgba(201,169,110,0.12)" : "transparent",
                  border: `1px solid ${on ? "rgba(201,169,110,0.35)" : "rgba(240,234,216,0.08)"}`,
                  color: on ? "#C9A96E" : "rgba(240,234,216,0.3)",
                }}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-sm text-[9px] font-semibold"
                  style={{ background: on ? "rgba(201,169,110,0.2)" : "rgba(240,234,216,0.05)" }}
                >
                  {a.initials}
                </span>
                {a.name.split(" ")[0]}
              </button>
            );
          })}
          <button
            onClick={() => setSelected(new Set(analysts.map((a) => a.id)))}
            className="px-3 py-1.5 rounded-sm text-xs transition-all duration-200"
            style={{ border: "1px solid rgba(240,234,216,0.08)", color: "rgba(240,234,216,0.25)" }}
          >
            All
          </button>
        </div>
      </div>

      {/* Alert cards */}
      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <p className="text-center text-xs py-10" style={{ color: "rgba(240,234,216,0.2)" }}>
            No analysts selected — toggle at least one above.
          </p>
        )}
        {visible.map((alert) => {
          const analyst = analysts.find((a) => a.id === alert.analystId)!;
          const s = statusColor[alert.status];
          return (
            <div
              key={alert.id}
              className="rounded-sm p-4 md:p-5 transition-all duration-200"
              style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(8,13,26,0.6)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Left */}
                <div className="flex items-start gap-3">
                  {/* Analyst avatar */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold"
                    style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
                  >
                    {analyst.initials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-base font-semibold" style={{ color: "#E8D5A3" }}>{alert.ticker}</span>
                      <span className="text-xs" style={{ color: "rgba(240,234,216,0.4)" }}>{alert.type}</span>
                      <span
                        className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                        style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: "rgba(240,234,216,0.4)" }}>
                      <span>Strike <span style={{ color: "#E8D5A3" }}>{alert.strike}</span></span>
                      <span>Expiry <span style={{ color: "#E8D5A3" }}>{alert.expiry}</span></span>
                      <span>Entry <span style={{ color: "#E8D5A3" }}>{alert.entry}</span></span>
                      <span>Target <span style={{ color: "#E8D5A3" }}>{alert.target}</span></span>
                    </div>
                    <p className="mt-2 text-xs" style={{ color: "rgba(240,234,216,0.35)", fontWeight: 300 }}>{alert.note}</p>
                    <p className="mt-1 text-[10px]" style={{ color: "rgba(240,234,216,0.2)" }}>{analyst.name} · {alert.time}</p>
                  </div>
                </div>
                {/* Return */}
                <div className="text-right">
                  <span
                    className="text-lg font-semibold"
                    style={{ color: alert.status === "closed" ? "rgba(240,234,216,0.4)" : "#4ade80" }}
                  >
                    {alert.return}
                  </span>
                  <p className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.2)" }}>
                    {alert.status === "closed" ? "Final" : "Target"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
