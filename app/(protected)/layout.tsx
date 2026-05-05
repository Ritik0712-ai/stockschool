import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/**
 * Protected pages layout.
 * Checks auth server-side — redirects to /login if not authenticated.
 * Used for /dashboard, /learn, /trade, /portfolio.
 */

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
