import { DefaultSession } from "next-auth";

/**
 * Type augmentation for NextAuth session to include user ID.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
