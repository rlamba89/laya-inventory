import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectData } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";

const NAV_ITEMS = [
  { label: "Types", href: "unit-types", icon: "T" },
  { label: "Units", href: "units", icon: "#" },

  { label: "Stages", href: "stages", icon: "S" },
  { label: "Siteplan", href: "siteplan", icon: "P" },
  { label: "Media", href: "media", icon: "M" },
  { label: "Settings", href: "settings", icon: "G" },
];

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;

  // Verify auth + admin role
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const hasAdminAccess = await isAdmin();
  if (!hasAdminAccess) {
    // Non-admin users get redirected to internal dashboard
    redirect(`/${projectSlug}/internal`);
  }

  const data = await getProjectData(projectSlug);
  if (!data) notFound();

  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-sand bg-sand-light">
        <div className="px-4 py-5 border-b border-sand">
          <Link
            href={`/${projectSlug}/internal`}
            className="text-[10px] font-medium uppercase tracking-widest text-stone hover:text-charcoal transition-colors"
          >
            &larr; Back to dashboard
          </Link>
          <h2 className="mt-2 font-serif text-lg font-semibold text-charcoal">
            Admin
          </h2>
          <p className="text-[10px] text-stone truncate">{data.project.name}</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={`/${projectSlug}/admin/${item.href}`}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-charcoal-mid hover:bg-sand hover:text-charcoal transition-colors"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sand text-[10px] font-bold text-stone">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-sand px-4 py-4">
          <AdminUserMenu />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
