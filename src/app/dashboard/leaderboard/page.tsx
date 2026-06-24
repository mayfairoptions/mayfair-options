const analysts = [
  { rank: 1,  name: "Marcus Reynolds", initials: "MR", specialty: "Tech & Mega-Cap",       trades: 142, wins: 126, winRate: "88.7%", avgReturn: "+84%",  streak: "11W", tier: "Lead"    },
  { rank: 2,  name: "Priya Sharma",    initials: "PS", specialty: "Macro & Index",          trades: 118, wins: 101, winRate: "85.6%", avgReturn: "+71%",  streak: "7W",  tier: "Senior"  },
  { rank: 3,  name: "Jordan Kane",     initials: "JK", specialty: "EV & Momentum",          trades: 97,  wins: 83,  winRate: "85.6%", avgReturn: "+92%",  streak: "5W",  tier: "Senior"  },
  { rank: 4,  name: "Sam Torres",      initials: "ST", specialty: "Energy & Commodities",   trades: 89,  wins: 74,  winRate: "83.1%", avgReturn: "+67%",  streak: "6W",  tier: "Analyst" },
  { rank: 5,  name: "Alex Chen",       initials: "AC", specialty: "Biotech & Small-Cap",    trades: 74,  wins: 61,  winRate: "82.4%", avgReturn: "+118%", streak: "3W",  tier: "Analyst" },
];

const tierStyle: Record<string, { color: string; border: string; bg: string }> = {
  Lead:    { color: "#C9A96E",              border: "rgba(201,169,110,0.3)",  bg: "rgba(201,169,110,0.08)"  },
  Senior:  { color: "rgba(240,234,216,0.7)", border: "rgba(240,234,216,0.15)", bg: "rgba(240,234,216,0.05)"  },
  Analyst: { color: "rgba(240,234,216,0.45)", border: "rgba(240,234,216,0.1)", bg: "transparent"             },
};

const rankColor = (r: number) =>
  r === 1 ? "#C9A96E" : r === 2 ? "rgba(240,234,216,0.6)" : r === 3 ? "rgba(201,169,110,0.5)" : "rgba(240,234,216,0.25)";

export default function LeaderboardPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="mb-10">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Members</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Analyst <span className="italic text-gold-gradient">Leaderboard</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Live rankings based on verified trade performance. Updated daily.
        </p>
      </div>

      {/* Top 3 podium */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {analysts.slice(0, 3).map((a) => (
          <div
            key={a.rank}
            className="flex flex-col items-center text-center rounded-sm p-6"
            style={{
              border: a.rank === 1 ? "1px solid rgba(201,169,110,0.3)" : "1px solid rgba(201,169,110,0.1)",
              background: a.rank === 1 ? "rgba(201,169,110,0.06)" : "rgba(201,169,110,0.02)",
              order: a.rank === 1 ? 0 : a.rank === 2 ? -1 : 1,
            }}
          >
            <div
              className="mb-3 text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: rankColor(a.rank) }}
            >
              #{a.rank}
            </div>
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm text-sm font-semibold"
              style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
            >
              {a.initials}
            </div>
            <div className="text-sm font-medium mb-1" style={{ color: "#E8D5A3" }}>{a.name}</div>
            <div className="text-xs mb-3" style={{ color: "rgba(240,234,216,0.35)" }}>{a.specialty}</div>
            <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "#C9A96E" }}>{a.winRate}</div>
            <div className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.3)" }}>Win Rate</div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div style={{ border: "1px solid rgba(201,169,110,0.1)" }}>
        <div
          className="grid text-[9px] tracking-[0.2em] uppercase px-5 py-3"
          style={{
            gridTemplateColumns: "40px 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr",
            borderBottom: "1px solid rgba(201,169,110,0.1)",
            background: "rgba(201,169,110,0.03)",
            color: "rgba(201,169,110,0.4)",
          }}
        >
          {["#", "Analyst", "Specialty", "W/L", "Win Rate", "Avg Return", "Streak", "Tier"].map(h => (
            <div key={h}>{h}</div>
          ))}
        </div>
        {analysts.map((a, i) => (
          <div
            key={a.rank}
            className="grid items-center px-5 py-4 transition-colors duration-200"
            style={{
              gridTemplateColumns: "40px 2fr 1.5fr 1fr 1fr 1fr 1fr 1fr",
              borderBottom: i < analysts.length - 1 ? "1px solid rgba(201,169,110,0.07)" : "none",
            }}
          >
            <div className="text-sm font-semibold" style={{ color: rankColor(a.rank) }}>{a.rank}</div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-sm text-[10px] font-semibold shrink-0"
                style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
              >
                {a.initials}
              </div>
              <span className="text-xs font-medium" style={{ color: "#E8D5A3" }}>{a.name}</span>
            </div>
            <div className="text-xs" style={{ color: "rgba(240,234,216,0.45)" }}>{a.specialty}</div>
            <div className="font-mono text-xs">
              <span style={{ color: "#C9A96E" }}>{a.wins}</span>
              <span style={{ color: "rgba(201,169,110,0.25)" }}>/{a.trades}</span>
            </div>
            <div className="text-sm font-semibold" style={{ color: "#C9A96E" }}>{a.winRate}</div>
            <div className="text-sm" style={{ color: "#E8D5A3" }}>{a.avgReturn}</div>
            <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(240,234,216,0.7)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#C9A96E", animation: "pulse 2s infinite" }} />
              {a.streak}
            </div>
            <div>
              <span
                className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                style={{ border: `1px solid ${tierStyle[a.tier].border}`, color: tierStyle[a.tier].color, background: tierStyle[a.tier].bg }}
              >
                {a.tier}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
