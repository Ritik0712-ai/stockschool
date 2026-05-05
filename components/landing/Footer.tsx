"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Footer with:
 * - 4-column layout (brand, quick links, legal, social)
 * - Disclaimer banner
 * - Dark background matching the hero
 * - Responsive stacking on mobile
 */

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/help" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const socialLinks = [
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You're in! 🎉 Check your inbox soon.");
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 text-white" id="footer">
      {/* CTA banner */}
      <div className="border-b border-white/5">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to start your{" "}
              <span className="text-accent">investing journey</span>?
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Join thousands of Indians who are learning to invest the smart way.
              It&apos;s free to get started.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105"
            >
              Start Learning Free
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
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
              <span className="font-heading text-xl font-bold">
                Stock<span className="text-accent">School</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              India&apos;s friendliest platform for learning stock market
              investing. Built by investors, for beginners.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  onClick={() => toast.info(`${social.label} profile coming soon!`)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-accent/20 flex items-center justify-center text-white/50 hover:text-accent transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-accent text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-accent text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">
              Stay Updated
            </h4>
            <p className="text-white/40 text-sm mb-4">
              Get weekly investing tips and platform updates.
            </p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <label htmlFor="footer-email-input" className="sr-only">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                id="footer-email-input"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-xl transition-colors duration-200"
                id="footer-subscribe-btn"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-white/5">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} StockSchool. All rights reserved.
            </p>
            <p className="text-white/25 text-xs text-center sm:text-right max-w-md">
              ⚠️ Educational platform only. Not SEBI registered. We do not
              provide financial advice. Investing involves risk; past performance
              does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
