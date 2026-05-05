"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiOutlineLogout } from "react-icons/hi";
import Button from "./ui/Button";

/**
 * Sticky navigation bar with:
 * - Logo with inline SVG chart icon
 * - Desktop menu links
 * - Auth state: shows Get Started (logged out) or user avatar + Dashboard (logged in)
 * - Mobile hamburger with slide-in drawer
 * - Background transitions on scroll (transparent → blurred dark)
 * - Hidden on auth pages (/signup, /login, /onboarding)
 */

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "#features" },
  { label: "Trade", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const authNavLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Learn", href: "/learn" },
  { label: "Trade", href: "/trade" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Settings", href: "/settings" },
  { label: "Help", href: "/help" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide navbar on auth pages (they have their own header)
  const authPaths = ["/signup", "/login", "/onboarding"];
  const isAuthPage = authPaths.includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Don't render on auth pages
  if (isAuthPage) return null;

  const isLoggedIn = status === "authenticated" && session?.user;
  const currentLinks = isLoggedIn ? authNavLinks : navLinks;

  // Generate user initials for avatar
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-primary/95 backdrop-blur-xl shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
        id="navbar"
      >
        <div className="container-max flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="logo">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-accent rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg
                width="20"
                height="20"
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
            <span className="font-heading text-xl sm:text-2xl font-bold text-white">
              Stock<span className="text-accent">School</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {currentLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  pathname === link.href
                    ? "text-accent"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* Auth buttons */}
            {status === "loading" ? (
              <div className="w-20 h-9 rounded-full bg-white/10 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* User avatar */}
                <Link
                  href="/dashboard"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-sm font-bold hover:scale-105 transition-transform"
                  title={session.user.name || "Dashboard"}
                >
                  {userInitials}
                </Link>
                {/* Sign out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-white/50 hover:text-white transition-colors p-2"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <HiOutlineLogout size={20} />
                </button>
              </div>
            ) : (
              <Button href="/signup" size="sm" id="nav-cta">
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-white hover:text-accent transition-colors"
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {isMobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-primary z-50 md:hidden shadow-2xl"
              id="mobile-menu"
            >
              <div className="flex flex-col p-6 pt-20 gap-2">
                {/* User info (if logged in) */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 px-4 py-3 mb-4 border-b border-white/10 pb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold">
                      {userInitials}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {session.user.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                )}

                {currentLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block py-3 px-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                        pathname === link.href
                          ? "text-accent bg-accent/10"
                          : "text-white/80 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4"
                >
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setIsMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2 justify-center py-3 px-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all"
                    >
                      <HiOutlineLogout size={20} />
                      Sign Out
                    </button>
                  ) : (
                    <Button href="/signup" size="md" className="w-full">
                      Get Started
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
