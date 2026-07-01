import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mayfair Options | Elite Options Trading Community",
  description:
    "An exclusive community of professional options traders. Institutional-grade analysis, live alerts, and verified performance.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "var(--navy)", color: "#f0ead8" }}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}