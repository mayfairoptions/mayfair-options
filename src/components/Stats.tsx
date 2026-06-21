"use client";

const stats = [
  {
    value: "85%+",
    label: "Win Rate",
    sub: "Across all tracked positions",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: "500+",
    label: "Trades Tracked",
    sub: "Live and historical positions",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    value: "5",
    label: "Expert Analysts",
    sub: "Institutional-grade professionals",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: "Live",
    label: "Daily Alerts",
    sub: "Real-time trade notifications",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export default function Stats() {
  return (
    <section id="stats" className="relative py-28 px-6">
      {/* Section divider top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="h-px w-24" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3))" }} />
        <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
          <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#C9A96E" opacity="0.5"/>
        </svg>
        <div className="h-px w-24" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.3), transparent)" }} />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p
            className="mb-3 text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "#C9A96E", letterSpacing: "0.25em" }}
          >
            Track Record
          </p>
          <h2
            className="text-3xl font-normal sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}
          >
            Numbers That Speak for{" "}
            <span className="italic text-gold-gradient">Themselves</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "rgba(201,169,110,0.08)" }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative flex flex-col items-center py-12 px-8 text-center group transition-all duration-500"
              style={{ background: "var(--navy-2)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(201,169,110,0.04)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--navy-2)";
              }}
            >
              {/* Icon */}
              <div
                className="mb-6 flex h-11 w-11 items-center justify-center rounded-sm"
                style={{ border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}
              >
                {s.icon}
              </div>

              {/* Value */}
              <div
                className="mb-2 text-4xl font-normal"
                style={{ fontFamily: "var(--font-playfair)", color: "#C9A96E" }}
              >
                {s.value}
              </div>

              {/* Label */}
              <div
                className="mb-2 text-xs tracking-[0.2em] uppercase font-medium"
                style={{ color: "#F0EAD8", letterSpacing: "0.15em" }}
              >
                {s.label}
              </div>

              {/* Sub */}
              <div
                className="text-xs leading-relaxed"
                style={{ color: "rgba(240,234,216,0.35)" }}
              >
                {s.sub}
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-1/4 right-1/4 h-px transition-all duration-500 group-hover:left-0 group-hover:right-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
