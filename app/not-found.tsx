import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <div className="mb-6">
          <span className="text-[120px] sm:text-[150px] font-heading font-bold leading-none gradient-text">
            404
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:bg-accent-light transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
