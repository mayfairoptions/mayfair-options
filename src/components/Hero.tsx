"use client";

import { useEffect, useRef, useState } from "react";

const chartPoints = [
  { x: 0,   y: 72 },
  { x: 8,   y: 68 },
  { x: 16,  y: 74 },
  { x: 24,  y: 60 },
  { x: 32,  y: 55 },
  { x: 40,  y: 62 },
  { x: 48,  y: 45 },
  { x: 56,  y: 38 },
  { x: 64,  y: 42 },
  { x: 72,  y: 30 },
  { x: 80,  y: 22 },
  { x: 88,  y: 28 },
  { x: 96,  y: 18 },
  { x: 100, y: 12 },
];

function buildPath(pts: { x: number; y: number }[]) {
  const w = 320;
  const h = 100;
  const coords = pts.map((p) => ({
    cx: (p.x / 100) * w,
    cy: (p.y / 100) * h,
  }));
  let d = `M ${coords[0].cx} ${coords[0].cy}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const cur = coords[i];
    const cpx = (prev.cx + cur.cx) / 2;
    d += ` C ${cpx} ${prev.cy}, ${cpx} ${cur.cy}, ${cur.cx} ${cur.cy}`;
  }
  return { d, coords };
}

const recentAlerts = [
  { ticker: "NVDA", type: "Call Spread", ret: "+127%", time: "2m ago", positive: true },
  { ticker: "SPY",  type: "Put Spread",  ret: "+205%", time: "1h ago", positive: true },
  { ticker: "TSLA", type: "Call",        ret: "+68%",  time: "3h ago", positive: true },
];

const tickers = [
  { sym: "QQQ",  val: "473.55", chg: "+1.12%" },
  { sym: "SPY",  val: "541.20", chg: "+0.84%" },
  { sym: "AMD",  val: "162.40", chg: "+1.93%" },
  { sym: "NVDA", val: "138.40", chg: "+2.30%" },
  { sym: "SPCX", val: "48.72",  chg: "+0.61%" },
  { sym: "TSLA", val: "251.80", chg: "+1.75%" },
  { sym: "AAPL", val: "211.60", chg: "+0.42%" },
  { sym: "VIX",  val: "13.82",  chg: "-4.20%" },
];

export default function Hero() {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [activeAlert, setActiveAlert] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLen(len);
      setTimeout(() => setDrawn(true), 300);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveAlert((p) => (p + 1) % recentAlerts.length), 2800);
    return () => clearInterval(id);
  }, []);

  const { d, coords } = buildPath(chartPoints);
  const last = coords[coords.length - 1];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)" }} />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(201,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl pt-24 pb-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">

          {/* ── LEFT: copy ── */}
          <div className="flex flex-col items-start">
            <h1
              className="mb-3 text-5xl font-normal leading-[1.1] tracking-tight sm:text-6xl xl:text-[72px]"
              style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}
            >
              Professional
            </h1>
            <h1
              className="mb-3 text-5xl font-normal leading-[1.1] italic sm:text-6xl xl:text-[72px]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className="text-gold-gradient">Options Trading</span>
            </h1>
            <h1
              className="mb-10 text-5xl font-normal leading-[1.1] tracking-tight sm:text-6xl xl:text-[72px]"
              style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}
            >
              Community
            </h1>

            {/* Divider */}
            <div className="mb-10 flex items-center gap-4">
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.5), transparent)" }} />
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#C9A96E" opacity="0.6"/>
              </svg>
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.5))" }} />
            </div>

            <p
              className="mb-12 max-w-md text-base leading-[1.9]"
              style={{ color: "rgba(240,234,216,0.5)", fontWeight: 300 }}
            >
              Join an elite circle of analysts delivering{" "}
              <span style={{ color: "rgba(240,234,216,0.8)" }}>high-probability options plays</span>{" "}
              with institutional-grade precision. Every trade logged. Every result verified.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #C9A96E 0%, #9A7A42 100%)",
                  color: "#03060f",
                  letterSpacing: "0.15em",
                  boxShadow: "0 8px 32px rgba(201,169,110,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                Join Premium
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#stats"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm text-xs tracking-[0.2em] uppercase transition-all duration-300"
                style={{
                  border: "1px solid rgba(201,169,110,0.2)",
                  color: "rgba(240,234,216,0.6)",
                  letterSpacing: "0.15em",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.5)";
                  (e.currentTarget as HTMLElement).style.color = "#C9A96E";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.2)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(240,234,216,0.6)";
                }}
              >
                View Performance
              </a>
            </div>

            {/* Trust row */}
            <div
              className="mt-14 flex flex-wrap gap-8 pt-10"
              style={{ borderTop: "1px solid rgba(201,169,110,0.1)" }}
            >
              {[
                { value: "85%+", label: "Win Rate" },
                { value: "500+", label: "Trades Logged" },
                { value: "5",    label: "Expert Analysts" },
                { value: "Daily", label: "Live Alerts" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "#C9A96E" }}>{s.value}</div>
                  <div className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(240,234,216,0.3)", letterSpacing: "0.18em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: dashboard visual ── */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Outer glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-sm"
              style={{ boxShadow: "0 0 80px rgba(201,169,110,0.08)", borderRadius: "4px" }}
            />

            <div
              className="w-full max-w-[460px] rounded-sm overflow-hidden"
              style={{
                background: "rgba(8,13,26,0.9)",
                border: "1px solid rgba(201,169,110,0.18)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,169,110,0.12)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Terminal top bar */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.03)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(201,169,110,0.3)" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(201,169,110,0.2)" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(201,169,110,0.1)" }} />
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(201,169,110,0.4)" }}>
                  Portfolio Performance
                </span>
                <span className="text-[10px]" style={{ color: "rgba(201,169,110,0.35)" }}>YTD</span>
              </div>

              {/* Metric row */}
              <div
                className="grid grid-cols-3 divide-x"
                style={{ borderBottom: "1px solid rgba(201,169,110,0.08)" }}
              >
                {[
                  { l: "Total Return", v: "+247%", pos: true },
                  { l: "Win Rate",     v: "85.6%", pos: true },
                  { l: "Trades",       v: "142",   pos: null },
                ].map((m) => (
                  <div key={m.l} className="py-4 px-4 text-center" style={{ borderRight: "1px solid rgba(201,169,110,0.08)" }}>
                    <div className="text-[9px] tracking-widest uppercase mb-1.5" style={{ color: "rgba(240,234,216,0.3)", letterSpacing: "0.18em" }}>{m.l}</div>
                    <div className="text-base font-semibold" style={{ fontFamily: "var(--font-playfair)", color: m.pos ? "#C9A96E" : "#E8D5A3" }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="px-5 pt-5 pb-2 relative">
                <svg
                  viewBox="0 0 320 100"
                  className="w-full"
                  style={{ height: "130px", overflow: "visible" }}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#9A7A42" />
                      <stop offset="100%" stopColor="#E8D5A3" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* Subtle horizontal grid */}
                  {[25, 50, 75].map((y) => (
                    <line
                      key={y}
                      x1="0" y1={y} x2="320" y2={y}
                      stroke="rgba(201,169,110,0.07)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Fill area */}
                  <path
                    d={`${d} L ${coords[coords.length-1].cx} 100 L 0 100 Z`}
                    fill="url(#chartFill)"
                  />

                  {/* Main line */}
                  <path
                    ref={pathRef}
                    d={d}
                    fill="none"
                    stroke="url(#chartLine)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    style={{
                      strokeDasharray: pathLen || 1000,
                      strokeDashoffset: drawn ? 0 : (pathLen || 1000),
                      transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />

                  {/* Live endpoint dot */}
                  {drawn && (
                    <>
                      <circle cx={last.cx} cy={last.cy} r="6" fill="rgba(201,169,110,0.15)">
                        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={last.cx} cy={last.cy} r="3" fill="#C9A96E" filter="url(#glow)" />
                    </>
                  )}
                </svg>

                {/* End label */}
                {drawn && (
                  <div
                    className="absolute top-4 right-5 text-xs font-semibold"
                    style={{ fontFamily: "var(--font-playfair)", color: "#C9A96E" }}
                  >
                    +247%
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="mx-5 h-px" style={{ background: "rgba(201,169,110,0.08)" }} />

              {/* Live alerts feed */}
              <div className="px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(201,169,110,0.4)", letterSpacing: "0.2em" }}>
                    Recent Alerts
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px]" style={{ color: "rgba(201,169,110,0.5)" }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#C9A96E", animation: "pulse 2s infinite" }} />
                    Live
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {recentAlerts.map((a, i) => (
                    <div
                      key={a.ticker}
                      className="flex items-center justify-between rounded-sm px-3 py-2.5 transition-all duration-500"
                      style={{
                        background: i === activeAlert ? "rgba(201,169,110,0.07)" : "rgba(201,169,110,0.02)",
                        border: `1px solid ${i === activeAlert ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.06)"}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-sm text-[11px] font-semibold"
                          style={{ background: "rgba(201,169,110,0.12)", color: "#C9A96E" }}
                        >
                          {a.ticker.slice(0,2)}
                        </div>
                        <div>
                          <div className="text-xs font-medium" style={{ color: "#E8D5A3" }}>{a.ticker}</div>
                          <div className="text-[10px]" style={{ color: "rgba(240,234,216,0.35)" }}>{a.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "#C9A96E" }}>{a.ret}</div>
                        <div className="text-[10px]" style={{ color: "rgba(240,234,216,0.25)" }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticker strip */}
              <div
                className="overflow-hidden px-0 py-2.5"
                style={{ borderTop: "1px solid rgba(201,169,110,0.08)", background: "rgba(201,169,110,0.02)" }}
              >
                <div
                  className="flex gap-6 whitespace-nowrap"
                  style={{
                    animation: "ticker 18s linear infinite",
                    width: "max-content",
                  }}
                >
                  {[...tickers, ...tickers].map((t, i) => (
                    <span key={i} className="flex items-center gap-2 px-4 text-[11px]">
                      <span style={{ color: "rgba(240,234,216,0.5)" }}>{t.sym}</span>
                      <span style={{ color: "rgba(240,234,216,0.7)" }}>{t.val}</span>
                      <span style={{ color: t.chg.startsWith("-") ? "#ef4444" : "#C9A96E" }}>{t.chg}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Ticker keyframe */}
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
