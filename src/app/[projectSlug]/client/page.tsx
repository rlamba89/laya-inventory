import { getTownhouses, getProjectData } from "@/lib/data";
import { SalesToolView } from "@/components/SalesToolView";

export const dynamic = "force-dynamic";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const [townhouses, projectData] = await Promise.all([
    getTownhouses(projectSlug),
    getProjectData(projectSlug),
  ]);

  // Server-side filter: remove units from unreleased / hidden stages
  let visibleTownhouses = townhouses;
  if (projectData) {
    const stageType = projectData.groupTypes.find((gt) => gt.slug === "stage");
    if (stageType) {
      const hiddenStageNumbers = new Set(
        projectData.groups
          .filter(
            (g) =>
              g.group_type_id === stageType.id &&
              (g.release_status === "unreleased" || !g.visible_to_clients)
          )
          .map((g) => parseInt(g.name.replace(/\D/g, "")))
          .filter((n) => !isNaN(n))
      );
      if (hiddenStageNumbers.size > 0) {
        visibleTownhouses = townhouses.filter(
          (th) => !hiddenStageNumbers.has(th.stg)
        );
      }
    }
  }

  return <SalesToolView viewMode="client" townhouses={visibleTownhouses} />;
}
