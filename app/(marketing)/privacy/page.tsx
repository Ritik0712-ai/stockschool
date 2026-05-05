import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — StockSchool",
  description: "Privacy Policy for StockSchool.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max max-w-3xl">
        <Link href="/" className="text-accent hover:text-accent-light text-sm mb-8 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Privacy Policy</h1>
        <div className="prose prose-invert prose-p:text-white/70 prose-a:text-accent max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            At StockSchool, we take your privacy seriously. This is a placeholder privacy policy for the early beta of our educational platform.
          </p>
          <h2>1. Information We Collect</h2>
          <p>
            When you create an account, we collect your name and email address. This information is used solely to provide you with access to our educational content and paper trading platform.
          </p>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to operate, maintain, and improve our services. We do not sell your personal data to third parties.
          </p>
          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information.
          </p>
          <p className="mt-8 pt-8 border-t border-white/10 text-sm">
            Questions about our privacy practices? <Link href="/contact">Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
