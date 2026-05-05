import Link from "next/link";

export const metadata = {
  title: "Terms of Service — StockSchool",
  description: "Terms of Service for StockSchool.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max max-w-3xl">
        <Link href="/" className="text-accent hover:text-accent-light text-sm mb-8 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Terms of Service</h1>
        <div className="prose prose-invert prose-p:text-white/70 prose-a:text-accent max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            Welcome to StockSchool. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>
          <h2>1. Educational Purpose Only</h2>
          <p>
            StockSchool is an educational platform designed to teach the fundamentals of stock market investing. <strong>We do not provide financial advice.</strong> All content, lessons, and simulated paper trading results are for educational purposes only.
          </p>
          <h2>2. Simulated Trading</h2>
          <p>
            The paper trading feature uses virtual currency. No real money is traded, and no real-world financial gains or losses are incurred. Market data may be delayed and should not be relied upon for making actual financial decisions.
          </p>
          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p className="mt-8 pt-8 border-t border-white/10 text-sm">
            Questions about our terms? <Link href="/contact">Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
