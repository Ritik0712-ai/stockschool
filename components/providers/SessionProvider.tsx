"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Client-side wrapper for NextAuth SessionProvider.
 * Must be a client component since SessionProvider uses React context.
 */

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
