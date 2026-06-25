"use client";

const free = [
  "Live TradingView charts — search any ticker",
  "Community chat with fellow members",
  "Win / Loss trade screenshot gallery",
  "Analyst performance leaderboard",
  "Weekly recap breakdowns",
];

const premium = [
  "Everything in Free",
  "Real-time analyst trade alerts",
  "Daily pre-market briefings",
  "Exclusive options flow data",
  "Private premium chat with analysts",
  "Pre-built Mayfair TradingView indicators",
  "Analyst selection — follow who you want",
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 px-6" style={{ background: "var(--navy-2)" }}>
      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)" }} />

      {/* Ambient */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px]"
        style={{ background: "radial-gradient(ellipse, rgba(201,169,110,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-[10px] tracking-[0.3em] uppercase" style={{ color: "#C9A96E", letterSpacing: "0.25em" }}>
            Membership
          </p>
          <h2 className="mb-4 text-3xl font-normal sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
            Simple, <span className="italic text-gold-gradient">Transparent</span> Pricing
          </h2>
          <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
            Start free and upgrade when you are ready. No hidden fees, no lock-ins, no obligations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Free */}
          <div
            className="flex flex-col p-10"
            style={{ border: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.02)" }}
          >
            <div className="mb-8">
              <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)", letterSpacing: "0.2em" }}>Tier I</p>
              <h3 className="mb-2 text-2xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}>Free Access</h3>
              <p className="text-xs" style={{ color: "rgba(240,234,216,0.35)" }}>For traders getting started</p>
            </div>

            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>$0</span>
              <span className="text-sm" style={{ color: "rgba(240,234,216,0.35)" }}>/ month</span>
            </div>

            {/* Divider */}
            <div className="mb-8 h-px" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.15), transparent)" }} />

            <ul className="mb-10 flex flex-col gap-4 flex-1">
              {free.map((item) => (
                <li key={item} className="flex items-start gap-4 text-sm">
                  <span className="mt-0.5 text-xs" style={{ color: "rgba(201,169,110,0.4)" }}>—</span>
                  <span style={{ color: "rgba(240,234,216,0.5)", fontWeight: 300 }}>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/sign-up"
              className="w-full py-4 text-center text-xs tracking-[0.2em] uppercase transition-all duration-300"
              style={{
                border: "1px solid rgba(201,169,110,0.2)",
                color: "rgba(201,169,110,0.6)",
                letterSpacing: "0.15em",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.4)";
                (e.currentTarget as HTMLElement).style.color = "#C9A96E";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.2)";
                (e.currentTarget as HTMLElement).style.color = "rgba(201,169,110,0.6)";
              }}
            >
              Get Started Free
            </a>
          </div>

          {/* Premium */}
          <div
            className="relative flex flex-col p-10"
            style={{
              border: "1px solid rgba(201,169,110,0.35)",
              background: "linear-gradient(160deg, rgba(201,169,110,0.07) 0%, rgba(8,13,26,0.95) 60%)",
              boxShadow: "0 0 60px rgba(201,169,110,0.06), inset 0 1px 0 rgba(201,169,110,0.15)",
            }}
          >
            {/* Badge */}
            <div
              className="absolute -top-px left-10 right-10 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.7), transparent)" }}
            />
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 text-[10px] tracking-[0.2em] uppercase"
              style={{
                background: "linear-gradient(135deg, #C9A96E, #9A7A42)",
                color: "#03060f",
                letterSpacing: "0.15em",
              }}
            >
              Most Popular
            </div>

            <div className="mb-8">
              <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "#C9A96E", letterSpacing: "0.2em" }}>Tier II</p>
              <h3 className="mb-2 text-2xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}>Premium</h3>
              <p className="text-xs" style={{ color: "rgba(240,234,216,0.4)" }}>For serious traders who want edge</p>
            </div>

            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-5xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}>$97</span>
              <span className="text-sm" style={{ color: "rgba(240,234,216,0.35)" }}>/ month</span>
            </div>
            <p className="mb-8 text-xs" style={{ color: "rgba(201,169,110,0.6)" }}>
              or <span className="font-medium" style={{ color: "#C9A96E" }}>$797 / year</span> — save 32%
            </p>

            {/* Divider */}
            <div className="mb-8 h-px" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.3), transparent)" }} />

            <ul className="mb-10 flex flex-col gap-4 flex-1">
              {premium.map((item) => (
                <li key={item} className="flex items-start gap-4 text-sm">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 4" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: "rgba(240,234,216,0.7)", fontWeight: 300 }}>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/sign-up"
              className="w-full py-4 text-center text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #C9A96E 0%, #9A7A42 50%, #C9A96E 100%)",
                backgroundSize: "200% 100%",
                color: "#03060f",
                letterSpacing: "0.15em",
                boxShadow: "0 8px 32px rgba(201,169,110,0.2)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(201,169,110,0.35)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(201,169,110,0.2)";
              }}
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-10 flex items-center justify-center gap-6">
          {["30-day guarantee", "Cancel anytime", "Stripe-secured payment"].map((t, i) => (
            <span key={t} className="flex items-center gap-2 text-[10px] tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.25)", letterSpacing: "0.12em" }}>
              {i > 0 && <span style={{ color: "rgba(201,169,110,0.2)" }}>·</span>}
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)" }} />
    </section>
  );
}
