import Link from "next/link";

export const metadata = {
  title: "About Us — StockSchool",
  description: "Learn more about the team behind StockSchool.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max max-w-3xl text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-6">About StockSchool</h1>
        <p className="text-lg text-white/70 mb-12">
          We are on a mission to democratize financial education in India.
        </p>
        
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
          <p className="text-white/60 mb-6 text-left">
            StockSchool was built by a passionate team of developers and investors who noticed a massive gap in how Indians learn about the stock market. Traditional resources are either too complex, full of jargon, or try to sell expensive courses.
          </p>
          <p className="text-white/60 mb-8 text-left">
            We wanted to build a platform where anyone could learn the fundamentals and practice trading with virtual money in a completely safe, risk-free environment. No gamification, no gambling—just pure education.
          </p>
          <Link href="/signup" className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark transition-colors">
            Join our community
          </Link>
        </div>
      </div>
    </div>
  );
}
