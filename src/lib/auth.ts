import { auth, currentUser } from "@clerk/nextjs/server";

export type UserRole = "super_admin" | "project_admin" | "sales_agent" | "viewer";

/**
 * Get the current user's role from Clerk public metadata.
 *
 * Defaults to "project_admin" if no role is set — this makes the initial
 * setup frictionless. To restrict access, set user roles in Clerk Dashboard:
 * User → Public Metadata → { "role": "sales_agent" }
 *
 * Roles:
 * - super_admin: full access to all projects
 * - project_admin: can manage assigned projects
 * - sales_agent: can view internal dashboard, no admin access
 * - viewer: read-only client view (shouldn't normally be logged in)
 */
export async function getUserRole(): Promise<UserRole> {
  const user = await currentUser();
  if (!user) return "viewer";

  const role = (user.publicMetadata as Record<string, unknown>)?.role as string | undefined;
  if (role && ["super_admin", "project_admin", "sales_agent", "viewer"].includes(role)) {
    return role as UserRole;
  }

  // Default: treat authenticated users as project_admin for frictionless setup
  return "project_admin";
}

/**
 * Check if the current user has admin access (super_admin or project_admin).
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "super_admin" || role === "project_admin";
}

/**
 * Check if the user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}
