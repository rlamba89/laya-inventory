import { notFound } from "next/navigation";
import { getProjectData } from "@/lib/data";
import { MediaGallery } from "@/components/admin/MediaGallery";

export const dynamic = "force-dynamic";

async function getUnitTypes(projectSlug: string) {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .single();

  if (!project) return [];

  const { data: unitTypes } = await supabase
    .from("unit_types")
    .select("id, code, name")
    .eq("project_id", project.id)
    .order("code");

  return (unitTypes ?? []) as { id: string; code: string; name: string | null }[];
}

export default async function AdminMediaPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const data = await getProjectData(projectSlug);
  if (!data) notFound();

  const unitTypes = await getUnitTypes(projectSlug);

  return <MediaGallery projectSlug={projectSlug} unitTypes={unitTypes} />;
}
