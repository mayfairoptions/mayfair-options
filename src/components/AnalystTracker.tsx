"use client";

const analysts = [
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
  },
];

const tierStyle: Record<string, { color: string; bg: string; border: string }> = {
  Lead: { color: "#C9A96E", bg: "rgba(201,169,110,0.08)", border: "rgba(201,169,110,0.3)" },
  Senior: { color: "rgba(240,234,216,0.7)", bg: "rgba(240,234,216,0.05)", border: "rgba(240,234,216,0.15)" },
  Analyst: { color: "rgba(240,234,216,0.45)", bg: "transparent", border: "rgba(240,234,216,0.1)" },
};

export default function AnalystTracker() {
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
              className="grid items-center transition-all duration-300 group"
              style={{
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr",
                borderBottom: i < analysts.length - 1 ? "1px solid rgba(201,169,110,0.07)" : "none",
                background: "transparent",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,169,110,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Analyst */}
              <div className="px-6 py-5 flex items-center gap-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-xs font-medium"
                  style={{
                    background: "rgba(201,169,110,0.08)",
                    border: "1px solid rgba(201,169,110,0.2)",
                    color: "#C9A96E",
                  }}
                >
                  {a.initials}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{a.name}</div>
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
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "#C9A96E", animation: "pulse 2s infinite" }}
                />
                <span className="font-mono text-xs" style={{ color: "rgba(240,234,216,0.7)" }}>{a.streak}</span>
              </div>

              {/* Tier */}
              <div className="px-6 py-5">
                <span
                  className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm"
                  style={{
                    border: `1px solid ${tierStyle[a.tier].border}`,
                    background: tierStyle[a.tier].bg,
                    color: tierStyle[a.tier].color,
                    letterSpacing: "0.12em",
                  }}
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
              className="p-6"
              style={{ borderBottom: i < analysts.length - 1 ? "1px solid rgba(201,169,110,0.08)" : "none" }}
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
                    <div className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{a.name}</div>
                    <div className="text-[10px]" style={{ color: "rgba(240,234,216,0.35)" }}>{a.specialty}</div>
                  </div>
                </div>
                <span
                  className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-sm"
                  style={{
                    border: `1px solid ${tierStyle[a.tier].border}`,
                    color: tierStyle[a.tier].color,
                    background: tierStyle[a.tier].bg,
                    letterSpacing: "0.12em",
                  }}
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
      </div>
    </section>
  );
}
