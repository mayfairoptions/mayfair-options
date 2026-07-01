import EarningsCalendar from "@/components/dashboard/EarningsCalendar";
import { getCalendarData } from "@/app/api/calendar/route";
import type { CalendarData } from "@/app/api/calendar/route";

async function prefetch<T>(fn: () => Promise<T>, ms = 2000): Promise<T | null> {
  try {
    return await Promise.race([fn(), new Promise<null>(r => setTimeout(() => r(null), ms))]);
  } catch {
    return null;
  }
}

export default async function CalendarPage() {
  const initialData: CalendarData | null = await prefetch(getCalendarData);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Markets</p>
        <h1 className="text-3xl font-normal" style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}>
          Earnings & <span className="italic text-gold-gradient">Economic Calendar</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          Upcoming earnings reports and high-impact economic events. Know what moves the market before it moves.
        </p>
      </div>
      <EarningsCalendar initialData={initialData} />
    </div>
  );
}
