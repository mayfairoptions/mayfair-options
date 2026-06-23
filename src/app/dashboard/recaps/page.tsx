const recaps = [
  {
    week: "Week of Jun 16, 2026",
    title: "Fed holds, CPI miss drives volatility",
    summary: "A strong week for put spreads as macro data came in below expectations. SPY put spread delivered +205%. NVDA call spread added +127% ahead of earnings. Overall portfolio return: +18.4% on risk.",
    trades: [
      { ticker: "SPY",  type: "Put Spread", result: "+205%", status: "Closed" },
      { ticker: "NVDA", type: "Call Spread", result: "+127%", status: "Closed" },
      { ticker: "TSLA", type: "Call",        result: "+68% (open)", status: "Active" },
    ],
    analyst: "Marcus Reynolds",
    initials: "MR",
    winRate: "88%",
    highlight: true,
  },
  {
    week: "Week of Jun 9, 2026",
    title: "Tech earnings season recap",
    summary: "Earnings season provided defined setups with elevated IV. 9 of 11 trades closed profitably. Key lesson: selling premium into earnings spikes with defined risk outperformed directional plays.",
    trades: [
      { ticker: "AAPL", type: "Iron Condor", result: "+44%",  status: "Closed" },
      { ticker: "AMD",  type: "Call Spread", result: "+91%",  status: "Closed" },
      { ticker: "MSFT", type: "Put Spread",  result: "-18%",  status: "Closed" },
    ],
    analyst: "Priya Sharma",
    initials: "PS",
    winRate: "82%",
    highlight: false,
  },
  {
    week: "Week of Jun 2, 2026",
    title: "Jobs data surprise — momentum trade",
    summary: "Non-farm payrolls beat estimates by 80k. Strong momentum setups in energy and financials. QQQ call spread rode the wave. VIX compression allowed for profitable premium selling.",
    trades: [
      { ticker: "QQQ", type: "Call Spread", result: "+72%", status: "Closed" },
      { ticker: "XLE", type: "Call",        result: "+55%", status: "Closed" },
      { ticker: "VIX", type: "Put",         result: "+38%", status: "Closed" },
    ],
    analyst: "Jordan Kane",
    initials: "JK",
    winRate: "85%",
    highlight: false,
  },
];

export default function RecapsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Members</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Weekly <span className="italic text-gold-gradient">Recaps</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Performance summaries from our analyst team — published every Friday.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {recaps.map((r, i) => (
          <div
            key={r.week}
            className="rounded-sm overflow-hidden"
            style={{
              border: `1px solid ${r.highlight ? "rgba(201,169,110,0.3)" : "rgba(201,169,110,0.1)"}`,
              background: r.highlight ? "rgba(201,169,110,0.04)" : "rgba(201,169,110,0.01)",
            }}
          >
            {r.highlight && (
              <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.7), rgba(201,169,110,0.1))" }} />
            )}
            <div className="p-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(201,169,110,0.5)" }}>{r.week}</p>
                  <h2 className="text-lg font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}>{r.title}</h2>
                </div>
                {r.highlight && (
                  <span className="shrink-0 text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-sm" style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E" }}>
                    Latest
                  </span>
                )}
              </div>

              {/* Summary */}
              <p className="mb-6 text-sm leading-relaxed" style={{ color: "rgba(240,234,216,0.5)", fontWeight: 300 }}>{r.summary}</p>

              {/* Trades */}
              <div className="mb-6 flex flex-col gap-2">
                {r.trades.map((t) => (
                  <div
                    key={t.ticker}
                    className="flex items-center justify-between rounded-sm px-4 py-3"
                    style={{ background: "rgba(201,169,110,0.03)", border: "1px solid rgba(201,169,110,0.08)" }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium" style={{ color: "#E8D5A3" }}>{t.ticker}</span>
                      <span className="text-xs" style={{ color: "rgba(240,234,216,0.4)" }}>{t.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-playfair)", color: t.result.startsWith("-") ? "#ef4444" : "#C9A96E" }}
                      >
                        {t.result}
                      </span>
                      <span
                        className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                        style={{
                          border: `1px solid ${t.status === "Active" ? "rgba(201,169,110,0.3)" : "rgba(240,234,216,0.1)"}`,
                          color: t.status === "Active" ? "#C9A96E" : "rgba(240,234,216,0.35)",
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-5" style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-[10px] font-semibold"
                    style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
                  >
                    {r.initials}
                  </div>
                  <span className="text-xs" style={{ color: "rgba(240,234,216,0.5)" }}>{r.analyst}</span>
                </div>
                <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "#C9A96E" }}>
                  {r.winRate} win rate
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
