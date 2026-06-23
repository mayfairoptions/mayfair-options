export default function PremiumGate({ feature }: { feature: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <div
        className="w-full max-w-md text-center p-10 rounded-sm"
        style={{
          background: "linear-gradient(160deg, rgba(201,169,110,0.07) 0%, rgba(8,13,26,0.9) 100%)",
          border: "1px solid rgba(201,169,110,0.25)",
          boxShadow: "0 0 60px rgba(201,169,110,0.06)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-sm"
          style={{ border: "1px solid rgba(201,169,110,0.3)", background: "rgba(201,169,110,0.08)" }}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#C9A96E" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Text */}
        <p className="mb-2 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
          Premium Feature
        </p>
        <h3
          className="mb-3 text-2xl font-normal"
          style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}
        >
          {feature}
        </h3>
        <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(240,234,216,0.45)", fontWeight: 300 }}>
          Upgrade to Premium to unlock {feature.toLowerCase()}, live trade alerts, and full analyst access.
        </p>

        {/* What you get */}
        <ul className="mb-8 flex flex-col gap-2 text-left">
          {[
            "Live trade alerts (real-time)",
            "TradingView charts — any ticker",
            "Community chat with analysts",
            "Win/Loss screenshot gallery",
            "Daily pre-market briefing",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-xs" style={{ color: "rgba(240,234,216,0.55)" }}>
              <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        <a
          href="/#pricing"
          className="block w-full py-3.5 text-center text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #C9A96E, #9A7A42)",
            color: "#03060f",
            letterSpacing: "0.15em",
            boxShadow: "0 8px 32px rgba(201,169,110,0.2)",
          }}
        >
          Upgrade to Premium — $97/mo
        </a>
        <p className="mt-4 text-[10px]" style={{ color: "rgba(240,234,216,0.2)" }}>
          30-day money-back guarantee · Cancel anytime
        </p>
      </div>
    </div>
  );
}
