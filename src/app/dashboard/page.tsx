import { currentUser } from "@clerk/nextjs/server";
import { getUserPlan } from "@/lib/plan";
import QuickLinks from "@/components/dashboard/QuickLinks";

export default async function DashboardPage() {
  const user = await currentUser();
  const plan = await getUserPlan();
  const isPremium = plan === "premium";
  const firstName = user?.firstName ?? "Trader";

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      {/* Welcome */}
      <div className="mb-10">
        <p className="mb-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
          Welcome back
        </p>
        <h1
          className="text-3xl font-normal"
          style={{ fontFamily: "var(--font-playfair)", color: "#F0EAD8" }}
        >
          Good morning, <span className="italic text-gold-gradient">{firstName}</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
          {isPremium
            ? "You have full Premium access. Markets open in a few hours."
            : "You're on the Free plan. Upgrade to unlock live alerts, charts, and more."}
        </p>
      </div>

      {/* Plan badge */}
      {!isPremium && (
        <div
          className="mb-10 flex items-center justify-between rounded-sm px-6 py-4"
          style={{
            background: "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(8,13,26,0.9) 100%)",
            border: "1px solid rgba(201,169,110,0.25)",
          }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: "#E8D5A3" }}>Upgrade to Premium</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(240,234,216,0.4)", fontWeight: 300 }}>
              Unlock live charts, community chat, gallery, and real-time alerts
            </p>
          </div>
          <a
            href="/#pricing"
            className="shrink-0 px-5 py-2.5 text-xs tracking-widest uppercase font-medium rounded-sm transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
          >
            Upgrade — $97/mo
          </a>
        </div>
      )}

      {/* Quick links grid */}
      <QuickLinks isPremium={isPremium} />

      {/* Stats summary */}
      <div
        className="mt-10 grid grid-cols-2 gap-px sm:grid-cols-4"
        style={{ background: "rgba(201,169,110,0.08)" }}
      >
        {[
          { label: "Win Rate", value: "85%+" },
          { label: "Trades This Week", value: "12" },
          { label: "Analysts Online", value: "3" },
          { label: "Alerts Today", value: "5" },
        ].map((s) => (
          <div key={s.label} className="py-6 px-5 text-center" style={{ background: "var(--navy)" }}>
            <div className="text-2xl font-normal mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#C9A96E" }}>{s.value}</div>
            <div className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(240,234,216,0.3)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
