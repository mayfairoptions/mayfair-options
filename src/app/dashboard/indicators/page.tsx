import Indicators from "@/components/dashboard/Indicators";

export default function IndicatorsPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="mb-8">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Premium</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Mayfair <span className="italic text-gold-gradient">Indicators</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Pre-built TradingView indicators used by our analysts. One click to add to your chart.
        </p>
      </div>
      <Indicators />
    </div>
  );
}
