"use client";

const links = [
  { label: "Weekly Recaps",    desc: "Latest analyst briefings",          href: "/dashboard/recaps",      free: true },
  { label: "Leaderboard",      desc: "Analyst performance rankings",       href: "/dashboard/leaderboard", free: true },
  { label: "Live Charts",      desc: "Search any ticker",                  href: "/dashboard/charts",      free: true },
  { label: "Community Chat",   desc: "Talk with analysts & members",       href: "/dashboard/chat",        free: true },
  { label: "Win/Loss Gallery", desc: "Share trade screenshots",            href: "/dashboard/gallery",     free: true },
];

export default function QuickLinks({ isPremium }: { isPremium: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((l) => {
        const locked = !l.free && !isPremium;
        return (
          <a
            key={l.href}
            href={locked ? "/#pricing" : l.href}
            className="group flex flex-col gap-3 rounded-sm p-6 transition-all duration-300"
            style={{
              border: "1px solid rgba(201,169,110,0.1)",
              background: "rgba(201,169,110,0.02)",
              opacity: locked ? 0.55 : 1,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: locked ? "rgba(240,234,216,0.4)" : "#E8D5A3" }}>
                {l.label}
              </span>
              {locked ? (
                <span
                  className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                  style={{ border: "1px solid rgba(201,169,110,0.2)", color: "rgba(201,169,110,0.4)" }}
                >
                  Pro
                </span>
              ) : (
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  style={{ color: "#C9A96E" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </div>
            <p className="text-xs" style={{ color: "rgba(240,234,216,0.35)", fontWeight: 300 }}>
              {l.desc}
            </p>
          </a>
        );
      })}
    </div>
  );
}
