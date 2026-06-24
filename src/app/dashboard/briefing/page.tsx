import Briefing from "@/components/dashboard/Briefing";

export default function BriefingPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Premium</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Pre-Market <span className="italic text-gold-gradient">Briefing</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Daily analyst notes posted before market open. Key levels, bias, and watchlist for the session.
        </p>
      </div>
      <Briefing />
    </div>
  );
}
