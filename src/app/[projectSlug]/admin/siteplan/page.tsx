import { notFound } from "next/navigation";
import { getProjectData, getHotspotUnits } from "@/lib/data";
import { HotspotCalibrator } from "@/components/admin/HotspotCalibrator";

export const dynamic = "force-dynamic";

export default async function AdminSiteplanPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const data = await getProjectData(projectSlug);
  if (!data) notFound();

  const units = await getHotspotUnits(projectSlug);

  return (
    <HotspotCalibrator
      projectSlug={projectSlug}
      siteplanUrl={data.project.siteplan_image_url}
      siteplanWidth={data.project.siteplan_width}
      siteplanHeight={data.project.siteplan_height}
      initialUnits={units}
    />
  );
}
