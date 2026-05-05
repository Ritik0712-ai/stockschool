import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";
import "./globals.css";

/**
 * Root layout: loads Google Fonts (Inter + Space Grotesk),
 * sets SEO metadata, wraps app in SessionProvider, and renders persistent Navbar.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StockSchool — Learn Investing Without Losing Money",
  description:
    "India's friendliest investment education platform. Master stocks through jargon-free lessons and risk-free paper trading with ₹10 Lakh virtual cash. Built for Indian beginners.",
  keywords: [
    "stock market",
    "investing",
    "India",
    "paper trading",
    "learn stocks",
    "investment education",
    "NSE",
    "BSE",
    "mutual funds",
    "SIP",
  ],
  authors: [{ name: "StockSchool" }],
  openGraph: {
    title: "StockSchool — Learn Investing Without Losing Money",
    description:
      "Master stocks through jargon-free lessons and risk-free paper trading. Built for Indian beginners.",
    type: "website",
    locale: "en_IN",
    siteName: "StockSchool",
  },
  twitter: {
    card: "summary_large_image",
    title: "StockSchool — Learn Investing Without Losing Money",
    description:
      "Master stocks through jargon-free lessons and risk-free paper trading. Built for Indian beginners.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}
      >
        <SessionProvider>
          <Navbar />
          <Toaster
            position="top-right"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
              },
            }}
          />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
