"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

/**
 * Login page with email/password form, error handling, and loading state.
 * On success → redirect to /dashboard (or /onboarding if profile incomplete).
 */

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Check if onboarding is complete
      const profileRes = await fetch("/api/onboarding/status");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (!profileData.onboardingDone) {
          router.push("/onboarding");
          return;
        }
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="glass rounded-2xl p-8 sm:p-10 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Welcome back
          </h1>
          <p className="text-white/50 mt-2 text-sm">
            Login to continue your learning journey
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-white/60 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                id="login-email"
                type="email"
                placeholder="priya@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="text-sm font-medium text-white/60">
                Password
              </label>
              <span className="text-xs text-white/30 cursor-not-allowed" title="Coming soon">
                Forgot Password?
              </span>
            </div>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            id="login-submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25 hover:shadow-accent/40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="px-3 text-white/30 text-sm">or</span>
          <div className="border-t border-white/10 w-full"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-accent hover:text-accent-light font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
