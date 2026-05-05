import Link from "next/link";

/**
 * Auth pages layout — minimal header with just the logo.
 * Used for /signup, /login, /onboarding pages.
 * Dark gradient background with centered card layout.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-hero-gradient relative">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Minimal header with just logo */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M3 17L9 11L13 15L21 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 7H21V11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-heading text-xl font-bold text-white">
            Stock<span className="text-accent">School</span>
          </span>
        </Link>
      </header>

      {/* Page content */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-12">
        {children}
      </div>
    </div>
  );
}
