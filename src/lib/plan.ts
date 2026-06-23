import { currentUser } from "@clerk/nextjs/server";

export async function getUserPlan(): Promise<"free" | "premium"> {
  const user = await currentUser();
  if (!user) return "free";
  const plan = (user.publicMetadata as { plan?: string })?.plan;
  return plan === "premium" ? "premium" : "free";
}

export async function isPremiumUser(): Promise<boolean> {
  const plan = await getUserPlan();
  return plan === "premium";
}
