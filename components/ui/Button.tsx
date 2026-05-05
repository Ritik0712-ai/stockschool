"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

/**
 * Reusable button component with multiple variants and sizes.
 * Renders as <Link> when `href` is provided, otherwise as <button>.
 */

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  id?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/25 hover:shadow-accent/40",
  outline:
    "border-2 border-accent text-accent hover:bg-accent hover:text-white",
  ghost:
    "text-gray-600 hover:text-accent hover:bg-accent/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  id,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 cursor-pointer";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <motion.span
      className={combinedStyles}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      id={id}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="border-none bg-transparent p-0">
      {content}
    </button>
  );
}
