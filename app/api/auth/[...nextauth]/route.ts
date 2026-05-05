import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth.js catch-all API route handler.
 * Handles GET (session checks) and POST (sign-in/sign-out) requests.
 */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
