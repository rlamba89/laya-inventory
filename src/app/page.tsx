import Link from "next/link";
import { getProjectList } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectSelectorPage() {
  const projects = await getProjectList();

  // If only one project, redirect directly
  if (projects.length === 1) {
    const { redirect } = await import("next/navigation");
    redirect(`/${projects[0].slug}/client`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-white px-6 py-12">
      <h1 className="mb-2 font-serif text-4xl font-semibold text-charcoal">
        Sales Tool
      </h1>
      <p className="mb-10 text-sm text-stone">
        Select a project to view
      </p>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}/client`}
            className="group rounded-xl border border-sand bg-white p-6 shadow-sm transition-all hover:border-terracotta hover:shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-charcoal group-hover:text-terracotta">
              {p.name}
            </h2>
            {p.tagline && (
              <p className="mt-1 text-xs text-stone">{p.tagline}</p>
            )}
            {p.location && (
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-stone/70">
                {p.location}
              </p>
            )}
            <span className="mt-3 inline-block rounded-full bg-sand-light px-3 py-1 text-[10px] font-medium text-charcoal-mid">
              {p.unit_label}s
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
