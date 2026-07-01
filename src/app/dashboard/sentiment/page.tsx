import SentimentDashboard from "@/components/dashboard/SentimentDashboard";
import { getMarketData } from "@/app/api/market-data/route";
import type { MarketDataPayload } from "@/app/api/market-data/route";

async function prefetch<T>(fn: () => Promise<T>, ms = 2000): Promise<T | null> {
  try {
    return await Promise.race([fn(), new Promise<null>(r => setTimeout(() => r(null), ms))]);
  } catch {
    return null;
  }
}

export default async function SentimentPage() {
  const initialData: MarketDataPayload | null = await prefetch(getMarketData);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Markets</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Market <span className="italic text-gold-gradient">Sentiment</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Fear & greed, sector flows, and smart money positioning — all in one view.
        </p>
      </div>
      <SentimentDashboard initialData={initialData} />
    </div>
  );
}
