"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const freeLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/recaps",
    label: "Weekly Recaps",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/leaderboard",
    label: "Leaderboard",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/charts",
    label: "Live Charts",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/chat",
    label: "Community Chat",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/gallery",
    label: "Win/Loss Gallery",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const premiumLinks: { href: string; label: string; icon: React.ReactNode }[] = [];

export default function Sidebar({ isPremium }: { isPremium: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside
      className="flex h-screen w-64 shrink-0 flex-col"
      style={{
        background: "var(--navy-2)",
        borderRight: "1px solid rgba(201,169,110,0.1)",
      }}
    >
      {/* Logo */}
      <a
        href="/"
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid rgba(201,169,110,0.08)" }}
      >
        <Image
          src="/logo.png"
          alt="Mayfair Options"
          width={32}
          height={32}
          className="object-contain"
          style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.3))" }}
        />
        <div className="leading-none">
          <span
            className="block text-sm font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}
          >
            Mayfair
          </span>
          <span className="block text-[10px] tracking-widest uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
            Options
          </span>
        </div>
      </a>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto px-3 py-5">
        {/* Free section */}
        <p className="mb-2 px-3 text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.35)" }}>
          Members
        </p>
        {freeLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs tracking-wide transition-all duration-200"
            style={{
              background: isActive(l.href) ? "rgba(201,169,110,0.1)" : "transparent",
              color: isActive(l.href) ? "#C9A96E" : "rgba(240,234,216,0.5)",
              borderLeft: isActive(l.href) ? "2px solid #C9A96E" : "2px solid transparent",
            }}
          >
            {l.icon}
            {l.label}
          </a>
        ))}

        {/* Premium section — shown only when there are premium-only links */}
        {premiumLinks.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-3 text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.35)" }}>
              Premium
            </p>
            {premiumLinks.map((l) => (
              <a
                key={l.href}
                href={isPremium ? l.href : "/dashboard"}
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs tracking-wide transition-all duration-200"
                style={{
                  background: isActive(l.href) && isPremium ? "rgba(201,169,110,0.1)" : "transparent",
                  color: isActive(l.href) && isPremium ? "#C9A96E" : isPremium ? "rgba(240,234,216,0.5)" : "rgba(240,234,216,0.25)",
                  borderLeft: isActive(l.href) && isPremium ? "2px solid #C9A96E" : "2px solid transparent",
                }}
              >
                {l.icon}
                {l.label}
                {!isPremium && (
                  <span className="ml-auto text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm" style={{ border: "1px solid rgba(201,169,110,0.2)", color: "rgba(201,169,110,0.4)" }}>
                    Pro
                  </span>
                )}
              </a>
            ))}
          </>
        )}
      </nav>

      {/* User + plan */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}
      >
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 rounded-sm" } }} />
        <div className="flex-1 min-w-0">
          <div className="text-xs truncate" style={{ color: "rgba(240,234,216,0.6)" }}>My Account</div>
          <div
            className="text-[10px] tracking-widest uppercase"
            style={{ color: isPremium ? "#C9A96E" : "rgba(240,234,216,0.3)" }}
          >
            {isPremium ? "Premium" : "Free"}
          </div>
        </div>
        <a href="/" className="shrink-0" title="Back to site">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "rgba(240,234,216,0.3)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
