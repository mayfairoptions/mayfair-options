"use client";

import Image from "next/image";

const cols = {
  Product: ["Features", "Pricing", "Analyst Tracker", "Trade History", "Discord"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Terms of Service", "Privacy Policy", "Disclaimer", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="relative px-6 py-20" style={{ background: "#020409" }}>
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.25) 30%, rgba(201,169,110,0.5) 50%, rgba(201,169,110,0.25) 70%, transparent 100%)" }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <a href="#" className="mb-8 flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Mayfair Options"
                width={44}
                height={44}
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(201,169,110,0.3))" }}
              />
              <div className="leading-none">
                <span className="block text-base font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}>
                  Mayfair
                </span>
                <span className="block text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
                  Options
                </span>
              </div>
            </a>

            <p className="mb-8 text-sm leading-[1.9]" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300, maxWidth: "280px" }}>
              Professional options trading community delivering high-probability plays with full transparency and institutional-grade analysis.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: "𝕏", title: "Twitter" },
                { label: "💬", title: "Discord" },
                { label: "📈", title: "TradingView" },
              ].map((s) => (
                <a
                  key={s.title}
                  href="#"
                  title={s.title}
                  className="flex h-9 w-9 items-center justify-center rounded-sm text-sm transition-all duration-300"
                  style={{
                    border: "1px solid rgba(201,169,110,0.15)",
                    color: "rgba(240,234,216,0.35)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "#C9A96E";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.15)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(240,234,216,0.35)";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([section, items]) => (
            <div key={section}>
              <h4
                className="mb-6 text-[9px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(201,169,110,0.5)", letterSpacing: "0.25em" }}
              >
                {section}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs transition-colors duration-300"
                      style={{ color: "rgba(240,234,216,0.35)", fontWeight: 300 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,234,216,0.35)")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="mt-16 pt-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
          style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}
        >
          <p className="max-w-2xl text-[11px] leading-relaxed" style={{ color: "rgba(240,234,216,0.2)", fontWeight: 300 }}>
            <span style={{ color: "rgba(201,169,110,0.4)" }}>Risk Disclaimer:</span>{" "}
            Options trading involves significant risk and is not suitable for all investors. Past performance is not indicative
            of future results. All content is for educational and informational purposes only and does not constitute financial advice.
          </p>
          <p className="shrink-0 text-[11px]" style={{ color: "rgba(240,234,216,0.2)" }}>
            © {new Date().getFullYear()} Mayfair Options LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
