"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="text-[100px] sm:text-[120px] font-heading font-bold leading-none text-red-500/80">
            500
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
          Something Went Wrong
        </h1>
        <p className="text-white/50 mb-8">
          An unexpected error occurred. Our team has been notified. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:bg-accent-light transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
