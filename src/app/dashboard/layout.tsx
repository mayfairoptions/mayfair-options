import { getUserPlan } from "@/lib/plan";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const plan = await getUserPlan();
  const isPremium = plan === "premium";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--navy)" }}>
      <Sidebar isPremium={isPremium} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
