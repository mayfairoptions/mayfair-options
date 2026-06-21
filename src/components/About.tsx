"use client";

const pillars = [
  {
    num: "01",
    title: "Institutional Analysis",
    desc: "Our analysts draw from professional trading desks, hedge fund strategies, and quantitative modeling to surface only the highest conviction setups.",
  },
  {
    num: "02",
    title: "Real-Time Alerts",
    desc: "Instant notifications the moment analysts enter or exit — strike, expiry, rationale, and defined risk parameters, every time.",
  },
  {
    num: "03",
    title: "Complete Transparency",
    desc: "Every trade is logged from entry to exit. No cherry-picking, no revisionist history. The tracker is updated live.",
  },
  {
    num: "04",
    title: "Risk-First Mindset",
    desc: "Every alert includes defined risk parameters. We focus on asymmetric setups where downside is capped and upside is significant.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:items-start">

          {/* Left */}
          <div>
            <p
              className="mb-5 text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "#C9A96E", letterSpacing: "0.25em" }}
            >
              Our Philosophy
            </p>
            <h2
              className="mb-8 text-3xl font-normal leading-snug sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8", lineHeight: "1.2" }}
            >
              Built by Traders,{" "}
              <br />
              <span className="italic text-gold-gradient">for Serious Traders</span>
            </h2>

            {/* Long rule */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.35), transparent)" }} />
            </div>

            <p
              className="mb-6 leading-[1.9] text-sm"
              style={{ color: "rgba(240,234,216,0.55)", fontWeight: 300 }}
            >
              Mayfair Options was founded by a group of professional traders frustrated with the noise
              in retail trading communities. We built a curated space where every alert is backed by
              rigorous analysis and every result is tracked with full accountability.
            </p>
            <p
              className="mb-12 leading-[1.9] text-sm"
              style={{ color: "rgba(240,234,216,0.55)", fontWeight: 300 }}
            >
              Whether you are learning to trade options or you are a seasoned professional seeking
              additional edge, our community delivers the discipline, the tools, and the transparency
              to operate at the highest level.
            </p>

            <a
              href="#pricing"
              className="inline-flex items-center gap-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 group"
              style={{ color: "#C9A96E", letterSpacing: "0.18em" }}
            >
              Begin Your Journey
              <span
                className="flex h-8 w-8 items-center justify-center rounded-sm transition-all duration-300 group-hover:translate-x-1"
                style={{ border: "1px solid rgba(201,169,110,0.3)" }}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>

          {/* Right: pillars */}
          <div className="flex flex-col gap-0" style={{ borderTop: "1px solid rgba(201,169,110,0.1)" }}>
            {pillars.map((p, i) => (
              <div
                key={p.num}
                className="flex gap-8 py-8 transition-all duration-300 group"
                style={{
                  borderBottom: "1px solid rgba(201,169,110,0.1)",
                }}
              >
                <span
                  className="shrink-0 text-xs font-mono pt-0.5"
                  style={{ color: "rgba(201,169,110,0.35)" }}
                >
                  {p.num}
                </span>
                <div>
                  <h3
                    className="mb-3 text-sm font-medium tracking-wide"
                    style={{ color: "#E8D5A3" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(240,234,216,0.45)", fontWeight: 300 }}
                  >
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
