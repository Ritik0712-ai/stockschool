"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

/**
 * Signup page with form validation, error handling, and auto-login on success.
 * Fields: Name, Email, Password (show/hide), Confirm Password
 * On success → signIn → redirect to /onboarding
 */

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- Validation ----

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Min 8 characters, 1 uppercase, 1 number";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ---- Submit ----

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      // Create account
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Auto-login after signup
      const loginRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginRes?.error) {
        setServerError("Account created but login failed. Please try logging in.");
        setLoading(false);
        return;
      }

      // Redirect to onboarding
      router.push("/onboarding");
    } catch {
      setServerError("Network error. Please try again.");
      setLoading(false);
    }
  }

  // ---- Field change ----

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="glass rounded-2xl p-8 sm:p-10 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Create your account
          </h1>
          <p className="text-white/50 mt-2 text-sm">
            Start your investing journey — it&apos;s free
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {serverError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                id="name"
                type="text"
                placeholder="Priya Sharma"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/25 focus:outline-none transition-colors ${
                  errors.name
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-accent/50"
                }`}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </div>
            {errors.name && (
              <p id="name-error" className="text-red-400 text-xs mt-1.5">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                id="email"
                type="email"
                placeholder="priya@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/25 focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-accent/50"
                }`}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-red-400 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-1.5">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/25 focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-accent/50"
                }`}
                aria-describedby={errors.password ? "password-error" : undefined}
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
            {errors.password && (
              <p id="password-error" className="text-red-400 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/60 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/25 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-accent/50"
                }`}
                aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-error" className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            id="signup-submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25 hover:shadow-accent/40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
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

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent-light font-medium transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
