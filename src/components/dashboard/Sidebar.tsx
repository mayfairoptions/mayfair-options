"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

type NavLink = {
  href: string;
  label: string;
  shortLabel: string;
  free: boolean;
  icon: React.ReactNode;
};

type Section = {
  label: string;
  links: NavLink[];
};

const overview: NavLink = {
  href: "/dashboard",
  label: "Overview",
  shortLabel: "Home",
  free: true,
  icon: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
};

const sections: Section[] = [
  {
    label: "Markets",
    links: [
      {
        href: "/dashboard/charts",
        label: "Live Charts",
        shortLabel: "Charts",
        free: true,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        href: "/dashboard/flow",
        label: "Options Flow",
        shortLabel: "Flow",
        free: false,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Community",
    links: [
      {
        href: "/dashboard/chat",
        label: "Community Chat",
        shortLabel: "Chat",
        free: true,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/gallery",
        label: "Win/Loss Gallery",
        shortLabel: "Gallery",
        free: true,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/leaderboard",
        label: "Leaderboard",
        shortLabel: "Ranks",
        free: true,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/premium-chat",
        label: "Premium Chat",
        shortLabel: "VIP",
        free: false,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Analysis",
    links: [
      {
        href: "/dashboard/recaps",
        label: "Weekly Recaps",
        shortLabel: "Recaps",
        free: true,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/alerts",
        label: "Live Alerts",
        shortLabel: "Alerts",
        free: false,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        ),
      },
      {
        href: "/dashboard/briefing",
        label: "Pre-Market Briefing",
        shortLabel: "Brief",
        free: false,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 6.343l-.707-.707m12.728 12.728l-.707-.707M6.343 17.657l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Tools",
    links: [
      {
        href: "/dashboard/indicators",
        label: "Indicators",
        shortLabel: "Tools",
        free: false,
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <a
      href={link.href}
      className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs tracking-wide transition-all duration-200"
      style={{
        background: active ? "rgba(201,169,110,0.1)" : "transparent",
        color: active ? "#C9A96E" : "rgba(240,234,216,0.5)",
        borderLeft: active ? "2px solid #C9A96E" : "2px solid transparent",
      }}
    >
      {link.icon}
      {link.label}
    </a>
  );
}

export default function Sidebar({ isPremium }: { isPremium: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const visibleSections = sections.map((s) => ({
    ...s,
    links: s.links.filter((l) => l.free || isPremium),
  })).filter((s) => s.links.length > 0);

  // 4 pinned tabs for mobile — always the most-used links
  const pinnedTabs = [
    overview,
    ...visibleSections.flatMap((s) => s.links),
  ].slice(0, 4);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex h-screen w-64 shrink-0 flex-col"
        style={{ background: "var(--navy-2)", borderRight: "1px solid rgba(201,169,110,0.1)" }}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 px-6 py-5 shrink-0"
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
            <span className="block text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}>
              Mayfair
            </span>
            <span className="block text-[10px] tracking-widest uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>
              Options
            </span>
          </div>
        </a>

        {/* Nav */}
        <nav className="flex flex-col flex-1 overflow-y-auto px-3 py-4 gap-5">
          {/* Overview */}
          <NavItem link={overview} active={isActive(overview.href)} />

          {/* Sections */}
          {visibleSections.map((section) => (
            <div key={section.label} className="flex flex-col gap-1">
              <p
                className="px-3 pb-1 text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "rgba(201,169,110,0.35)" }}
              >
                {section.label}
              </p>
              {section.links.map((l) => (
                <NavItem key={l.href} link={l} active={isActive(l.href)} />
              ))}
            </div>
          ))}
        </nav>

        {/* User + plan */}
        <div
          className="px-4 py-4 flex items-center gap-3 shrink-0"
          style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}
        >
          <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 rounded-sm" } }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs truncate" style={{ color: "rgba(240,234,216,0.6)" }}>My Account</div>
            <div className="text-[10px] tracking-widest uppercase" style={{ color: isPremium ? "#C9A96E" : "rgba(240,234,216,0.3)" }}>
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

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1 py-2"
        style={{ background: "rgba(8,13,26,0.97)", borderTop: "1px solid rgba(201,169,110,0.12)", backdropFilter: "blur(20px)" }}
      >
        {pinnedTabs.map((l) => {
          const active = isActive(l.href);
          return (
            <a
              key={l.href}
              href={l.href}
              className="flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200"
              style={{ color: active ? "#C9A96E" : "rgba(240,234,216,0.35)" }}
            >
              {l.icon}
              <span className="text-[9px] tracking-wide">{l.shortLabel}</span>
            </a>
          );
        })}

        {/* Menu button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200"
          style={{ color: drawerOpen ? "#C9A96E" : "rgba(240,234,216,0.35)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[9px] tracking-wide">Menu</span>
        </button>
      </nav>

      {/* ── Mobile slide-up drawer ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-50"
            style={{ background: "rgba(3,6,15,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-lg overflow-hidden"
            style={{ background: "var(--navy-2)", border: "1px solid rgba(201,169,110,0.15)", maxHeight: "80vh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full" style={{ background: "rgba(201,169,110,0.25)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4" style={{ borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Mayfair Options" width={24} height={24} className="object-contain" style={{ filter: "drop-shadow(0 0 4px rgba(201,169,110,0.3))" }} />
                <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3" }}>Mayfair Options</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ color: "rgba(240,234,216,0.3)" }}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="overflow-y-auto px-4 py-4 flex flex-col gap-4" style={{ maxHeight: "calc(80vh - 120px)" }}>
              <a
                href={overview.href}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-sm text-sm transition-all duration-200"
                style={{
                  background: isActive(overview.href) ? "rgba(201,169,110,0.1)" : "transparent",
                  color: isActive(overview.href) ? "#C9A96E" : "rgba(240,234,216,0.6)",
                  borderLeft: isActive(overview.href) ? "2px solid #C9A96E" : "2px solid transparent",
                }}
              >
                {overview.icon}
                {overview.label}
              </a>

              {visibleSections.map((section) => (
                <div key={section.label} className="flex flex-col gap-1">
                  <p className="px-3 pb-1 text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.35)" }}>
                    {section.label}
                  </p>
                  {section.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-sm text-sm transition-all duration-200"
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
                </div>
              ))}

              {/* User row */}
              <div className="flex items-center gap-3 px-3 py-3 mt-2" style={{ borderTop: "1px solid rgba(201,169,110,0.08)" }}>
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 rounded-sm" } }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{ color: "rgba(240,234,216,0.6)" }}>My Account</div>
                  <div className="text-[10px] tracking-widest uppercase" style={{ color: isPremium ? "#C9A96E" : "rgba(240,234,216,0.3)" }}>
                    {isPremium ? "Premium" : "Free"}
                  </div>
                </div>
                <a href="/" style={{ color: "rgba(240,234,216,0.3)" }} title="Back to site">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
