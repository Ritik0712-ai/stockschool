import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Analytics — StockSchool",
  description:
    "Analyze your paper trading performance with charts, trade insights, allocation breakdowns, and behavioral tips.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
