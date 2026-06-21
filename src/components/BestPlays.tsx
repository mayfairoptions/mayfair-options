"use client";

const trades = [
  {
    ticker: "NVDA",
    type: "Call Spread",
    strike: "130 / 140 C",
    expiry: "Jun 28 '26",
    entry: "$1.85",
    exit: "$4.20",
    returnPct: "+127%",
    status: "Closed",
    analyst: "Marcus Reynolds",
    initials: "MR",
    note: "Breakout above key resistance ahead of earnings. IV crush hedged with spread structure for defined risk profile.",
    positive: true,
  },
  {
    ticker: "SPY",
    type: "Put Spread",
    strike: "540 / 530 P",
    expiry: "Jun 21 '26",
    entry: "$2.10",
    exit: "$6.40",
    returnPct: "+205%",
    status: "Closed",
    analyst: "Priya Sharma",
    initials: "PS",
    note: "CPI miss combined with hawkish Fed tone. High-probability macro setup with tight risk on expiry week.",
    positive: true,
  },
  {
    ticker: "TSLA",
    type: "Call",
    strike: "250 C",
    expiry: "Jul 18 '26",
    entry: "$3.50",
    exit: "—",
    returnPct: "+68%",
    status: "Active",
    analyst: "Jordan Kane",
    initials: "JK",
    note: "Catalyst: new model delivery event. Delta 0.42, momentum confirming above 20-day EMA with volume expansion.",
    positive: true,
  },
];

export default function BestPlays() {
  return (
    <section id="best-plays" className="relative py-28 px-6" style={{ background: "var(--navy-2)" }}>
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)" }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="mb-4 text-[10px] tracking-[0.3em] uppercase" style={{ color: "#C9A96E", letterSpacing: "0.25em" }}>
            Weekly Highlights
          </p>
          <h2 className="mb-6 text-3xl font-normal sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
            Best Plays <span className="italic text-gold-gradient">This Week</span>
          </h2>
          <p className="max-w-md text-sm leading-relaxed" style={{ color: "rgba(240,234,216,0.45)", fontWeight: 300 }}>
            A curated snapshot of top-performing trades called by our analyst team — fully logged and independently verified.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {trades.map((t) => (
            <div
              key={t.ticker + t.strike}
              className="group relative flex flex-col border-gold-gradient transition-all duration-500"
              style={{
                background: "linear-gradient(160deg, rgba(201,169,110,0.04) 0%, rgba(8,13,26,0.8) 100%)",
                borderRadius: "2px",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Status bar top */}
              <div
                className="h-0.5 w-full rounded-t-sm"
                style={{
                  background: t.status === "Active"
                    ? "linear-gradient(90deg, rgba(201,169,110,0.6), rgba(201,169,110,0.1))"
                    : "linear-gradient(90deg, rgba(201,169,110,0.3), rgba(201,169,110,0.05))",
                }}
              />

              <div className="p-7 flex flex-col flex-1">
                {/* Top row */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div
                      className="text-3xl font-normal mb-1"
                      style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}
                    >
                      {t.ticker}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] tracking-widest uppercase"
                        style={{ color: "rgba(201,169,110,0.6)", letterSpacing: "0.15em" }}
                      >
                        {t.type}
                      </span>
                      <span style={{ color: "rgba(201,169,110,0.2)" }}>·</span>
                      <span className="text-[10px]" style={{ color: "rgba(240,234,216,0.3)" }}>{t.expiry}</span>
                    </div>
                  </div>
                  <span
                    className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm"
                    style={{
                      border: t.status === "Active"
                        ? "1px solid rgba(201,169,110,0.4)"
                        : "1px solid rgba(201,169,110,0.15)",
                      color: t.status === "Active" ? "#C9A96E" : "rgba(201,169,110,0.5)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {t.status === "Active" && (
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full mr-1.5"
                        style={{ background: "#C9A96E", animation: "pulse 2s infinite" }}
                      />
                    )}
                    {t.status}
                  </span>
                </div>

                {/* Strike */}
                <div
                  className="mb-6 text-lg font-mono"
                  style={{ color: "rgba(240,234,216,0.7)", letterSpacing: "0.05em" }}
                >
                  {t.strike}
                </div>

                {/* Metrics */}
                <div
                  className="mb-6 grid grid-cols-3 divide-x"
                  style={{
                    background: "rgba(201,169,110,0.03)",
                    border: "1px solid rgba(201,169,110,0.1)",
                  }}
                >
                  {[
                    { l: "Entry", v: t.entry },
                    { l: "Exit", v: t.exit },
                    { l: "Return", v: t.returnPct, gold: true },
                  ].map((m) => (
                    <div key={m.l} className="py-4 px-4 text-center" style={{ borderRight: "1px solid rgba(201,169,110,0.1)" }}>
                      <div className="text-[9px] tracking-widest uppercase mb-2" style={{ color: "rgba(240,234,216,0.3)", letterSpacing: "0.2em" }}>{m.l}</div>
                      <div
                        className="text-sm font-mono"
                        style={{ color: m.gold ? "#C9A96E" : "rgba(240,234,216,0.7)" }}
                      >
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <p
                  className="mb-6 text-xs leading-relaxed flex-1"
                  style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}
                >
                  {t.note}
                </p>

                {/* Analyst */}
                <div
                  className="flex items-center gap-3 pt-5"
                  style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-sm text-[11px] font-medium"
                    style={{
                      background: "rgba(201,169,110,0.1)",
                      border: "1px solid rgba(201,169,110,0.2)",
                      color: "#C9A96E",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "rgba(240,234,216,0.6)" }}>{t.analyst}</div>
                    <div className="text-[10px]" style={{ color: "rgba(240,234,216,0.25)" }}>Lead Analyst</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase transition-all duration-300"
            style={{ color: "rgba(201,169,110,0.6)", letterSpacing: "0.18em" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,169,110,0.6)")}
          >
            View full trade history
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)" }}
      />
    </section>
  );
}
