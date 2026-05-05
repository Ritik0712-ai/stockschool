import Link from "next/link";

export const metadata = {
  title: "Disclaimer — StockSchool",
  description: "Financial Disclaimer for StockSchool.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max max-w-3xl">
        <Link href="/" className="text-accent hover:text-accent-light text-sm mb-8 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Financial Disclaimer</h1>
        <div className="prose prose-invert prose-p:text-white/70 prose-a:text-accent max-w-none">
          <p className="lead font-semibold text-white">
            StockSchool is not a registered investment advisor, broker/dealer, or financial institution.
          </p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl my-6">
            <p className="text-sm m-0">
              <strong>Risk Warning:</strong> Investing in the stock market involves a high degree of risk. Past performance is not indicative of future results. You should carefully consider whether trading is suitable for you in light of your financial condition.
            </p>
          </div>
          <h2>Educational Use Only</h2>
          <p>
            All information provided on StockSchool, including lessons, quizzes, market data, and simulated trading results, is intended for educational and informational purposes only. None of the content on this website constitutes financial advice, a recommendation to buy or sell any security, or an endorsement of any particular investment strategy.
          </p>
          <h2>Data Accuracy</h2>
          <p>
            While we strive to provide accurate simulated market data, we do not guarantee the timeliness, sequence, accuracy, or completeness of any data provided on the platform. The paper trading feature is a simulation and may not exactly replicate real-world trading conditions, liquidity, or execution speeds.
          </p>
          <p className="mt-8 pt-8 border-t border-white/10 text-sm">
            By using StockSchool, you acknowledge and agree to this disclaimer. <Link href="/terms">Read our full Terms of Service</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
