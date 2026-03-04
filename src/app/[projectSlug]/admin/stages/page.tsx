import { notFound } from "next/navigation";
import { getProjectData } from "@/lib/data";
import { StageReleaseManager } from "@/components/admin/StageReleaseManager";

export const dynamic = "force-dynamic";

export default async function AdminStagesPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const data = await getProjectData(projectSlug);
  if (!data) notFound();

  // Get stage groups
  const stageType = data.groupTypes.find((gt) => gt.slug === "stage");
  const stages = stageType
    ? data.groups
        .filter((g) => g.group_type_id === stageType.id)
        .sort((a, b) => a.sort_order - b.sort_order)
    : [];

  return <StageReleaseManager projectSlug={projectSlug} initialStages={stages} />;
}
