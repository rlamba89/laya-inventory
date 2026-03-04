import { notFound } from "next/navigation";
import { getAdminUnits, getUnitTypes, getProjectData } from "@/lib/data";
import { UnitsTable } from "@/components/admin/UnitsTable";

export const dynamic = "force-dynamic";

export default async function AdminUnitsPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const [units, unitTypes, projectData] = await Promise.all([
    getAdminUnits(projectSlug),
    getUnitTypes(projectSlug),
    getProjectData(projectSlug),
  ]);

  if (!projectData) notFound();

  // Separate groups into stages and areas
  const stageType = projectData.groupTypes.find((gt) => gt.slug === "stage");
  const areaType = projectData.groupTypes.find((gt) => gt.slug === "area");

  const stages = projectData.groups
    .filter((g) => g.group_type_id === stageType?.id)
    .map((g) => ({ id: g.id, name: g.name }));

  const areas = projectData.groups
    .filter((g) => g.group_type_id === areaType?.id)
    .map((g) => ({ id: g.id, name: g.name }));

  return (
    <UnitsTable
      initialUnits={units}
      projectSlug={projectSlug}
      unitTypes={unitTypes.map((ut) => ({ id: ut.id, code: ut.code, name: ut.name }))}
      stages={stages}
      areas={areas}
      currencySymbol={projectData.project.currency_symbol}
      unitLabelShort={projectData.project.unit_label_short}
    />
  );
}
