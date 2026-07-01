import OptionsFlow from "@/components/dashboard/OptionsFlow";
import { getOptionsFlowData } from "@/app/api/options-flow/route";
import type { FlowPayload } from "@/app/api/options-flow/route";

async function prefetch<T>(fn: () => Promise<T>, ms = 2000): Promise<T | null> {
  try {
    return await Promise.race([fn(), new Promise<null>(r => setTimeout(() => r(null), ms))]);
  } catch {
    return null;
  }
}

export default async function FlowPage() {
  const initialData: FlowPayload | null = await prefetch(getOptionsFlowData);

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-8">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Premium</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Options <span className="italic text-gold-gradient">Flow</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Unusual options activity — large premium prints and sweeps across major tickers.
        </p>
      </div>
      <OptionsFlow initialData={initialData} />
    </div>
  );
}
