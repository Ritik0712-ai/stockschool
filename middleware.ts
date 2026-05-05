import { withAuth } from "next-auth/middleware";

/**
 * NextAuth middleware for route protection.
 * Redirects unauthenticated users to /login for protected paths.
 */

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/trade/:path*",
    "/portfolio/:path*",
    "/onboarding/:path*",
    "/settings/:path*",
    "/help/:path*",
  ],
};
