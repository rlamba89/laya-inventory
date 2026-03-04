import { notFound } from "next/navigation";
import { getProjectData } from "@/lib/data";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const data = await getProjectData(projectSlug);
  if (!data) notFound();

  return <SettingsEditor project={data.project} projectSlug={projectSlug} />;
}
