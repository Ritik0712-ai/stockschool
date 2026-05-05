import Link from "next/link";

export const metadata = {
  title: "Blog — StockSchool",
  description: "Read the latest updates from StockSchool.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max max-w-4xl text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-6">StockSchool Blog</h1>
        <p className="text-lg text-white/70 mb-12">
          Insights, updates, and educational articles.
        </p>
        
        <div className="p-12 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mb-6">
            📝
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
          <p className="text-white/60 mb-6 max-w-md text-center">
            We're currently writing some amazing content for our learners. Check back soon for our first blog post!
          </p>
          <Link href="/" className="text-accent hover:text-accent-light font-medium">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
