import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectData } from "@/lib/data";
import { ProjectProvider } from "@/providers/ProjectProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Ensure layout always fetches fresh project data (stages, groups, etc.)
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}): Promise<Metadata> {
  const { projectSlug } = await params;
  const data = await getProjectData(projectSlug);
  if (!data) return { title: "Project Not Found" };

  return {
    title: `${data.project.name} — Sales Tool`,
    description: data.project.description ?? undefined,
  };
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const data = await getProjectData(projectSlug);

  if (!data) notFound();

  return (
    <ProjectProvider
      project={data.project}
      groupTypes={data.groupTypes}
      groups={data.groups}
    >
      <ThemeProvider branding={data.project.branding}>
        {children}
      </ThemeProvider>
    </ProjectProvider>
  );
}
