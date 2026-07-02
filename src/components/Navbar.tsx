"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Performance", href: "#stats" },
  { label: "Best Plays", href: "#best-plays" },
  { label: "Analysts", href: "#analysts" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b py-0" : "py-2"
      }`}
      style={{
        borderColor: scrolled ? "rgba(201,169,110,0.15)" : "transparent",
        background: scrolled ? "rgba(3,6,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-[68px] items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Mayfair Options"
              width={40}
              height={40}
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 8px rgba(201,169,110,0.35))" }}
            />
            <div className="leading-none">
              <span
                className="block text-base font-semibold tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-playfair)", color: "#E8D5A3", letterSpacing: "0.12em" }}
              >
                Mayfair
              </span>
              <span
                className="block text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(201,169,110,0.6)", letterSpacing: "0.25em" }}
              >
                Options
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs tracking-widest uppercase transition-colors duration-300"
                style={{ color: "#F0EAD8", letterSpacing: "0.12em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={e => (e.currentTarget.style.color = "#F0EAD8")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300"
                  style={{ border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E", letterSpacing: "0.1em" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,169,110,0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.6)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.3)";
                  }}
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm font-medium transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #C9A96E, #9A7A42)",
                    color: "#03060f",
                    letterSpacing: "0.1em",
                    boxShadow: "0 4px 15px rgba(201,169,110,0.2)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 25px rgba(201,169,110,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(201,169,110,0.2)";
                  }}
                >
                  Join Free
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <a
                href="/dashboard"
                className="text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300"
                style={{ border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E", letterSpacing: "0.1em" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(201,169,110,0.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                Dashboard
              </a>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 rounded-sm",
                  },
                }}
              />
            </Show>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden transition-colors duration-300"
            style={{ color: "rgba(201,169,110,0.7)" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 py-6 flex flex-col gap-5"
          style={{ background: "rgba(3,6,15,0.97)", borderTop: "1px solid rgba(201,169,110,0.12)" }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(240,234,216,0.6)", letterSpacing: "0.15em" }}
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="flex-1 text-center text-xs tracking-widest uppercase py-3 rounded-sm"
                  style={{ border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E" }}
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="flex-1 text-center text-xs tracking-widest uppercase py-3 rounded-sm font-medium"
                  style={{ background: "linear-gradient(135deg, #C9A96E, #9A7A42)", color: "#03060f" }}
                >
                  Join Free
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <a
                href="/dashboard"
                className="flex-1 text-center text-xs tracking-widest uppercase py-3 rounded-sm"
                style={{ border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E" }}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </a>
              <div className="flex items-center justify-center">
                <UserButton />
              </div>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}
