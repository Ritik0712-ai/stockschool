import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

/**
 * NextAuth.js v4 configuration.
 *
 * - Uses PrismaAdapter for session/account storage
 * - JWT strategy (required for Credentials provider)
 * - Custom pages for login/signup
 * - Callbacks to attach userId to session
 */

export const authOptions: NextAuthOptions = {
  // Prisma adapter for database-backed sessions
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  // Use JWT for session management (required with Credentials provider)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  // Custom page routes
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },

  // JWT & Session callbacks to attach user ID
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, attach the user ID to the JWT
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach user ID from JWT to the session object
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },

  // Security
  secret: process.env.NEXTAUTH_SECRET,

  // Debug in development
  debug: process.env.NODE_ENV === "development",
};
