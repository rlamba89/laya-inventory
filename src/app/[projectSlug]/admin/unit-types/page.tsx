import { notFound } from "next/navigation";
import { getProjectData } from "@/lib/data";
import { UnitTypesManager } from "@/components/admin/UnitTypesManager";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface UnitTypeWithMedia {
  id: string;
  code: string;
  name: string | null;
  beds: number | null;
  baths: number | null;
  cars: number | null;
  description: string | null;
  sort_order: number;
  render_url: string | null;
  floorplan_url: string | null;
}

async function getUnitTypesWithMedia(projectId: string): Promise<UnitTypeWithMedia[]> {
  const supabase = createAdminClient();

  const { data: unitTypes } = await supabase
    .from("unit_types")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order");

  if (!unitTypes || unitTypes.length === 0) return [];

  const typeIds = unitTypes.map((ut: { id: string }) => ut.id);

  const { data: media } = await supabase
    .from("media")
    .select("unit_type_id, media_type, url")
    .in("unit_type_id", typeIds)
    .in("media_type", ["render", "floorplan"])
    .order("sort_order");

  const mediaMap: Record<string, { renderUrl: string | null; floorplanUrl: string | null }> = {};
  for (const m of media ?? []) {
    if (!mediaMap[m.unit_type_id]) {
      mediaMap[m.unit_type_id] = { renderUrl: null, floorplanUrl: null };
    }
    if (m.media_type === "render" && !mediaMap[m.unit_type_id].renderUrl) {
      mediaMap[m.unit_type_id].renderUrl = m.url;
    }
    if (m.media_type === "floorplan" && !mediaMap[m.unit_type_id].floorplanUrl) {
      mediaMap[m.unit_type_id].floorplanUrl = m.url;
    }
  }

  return unitTypes.map((ut: Record<string, unknown>): UnitTypeWithMedia => ({
    id: ut.id as string,
    code: ut.code as string,
    name: (ut.name as string) ?? null,
    beds: (ut.beds as number) ?? null,
    baths: (ut.baths as number) ?? null,
    cars: (ut.cars as number) ?? null,
    description: (ut.description as string) ?? null,
    sort_order: (ut.sort_order as number) ?? 0,
    render_url: mediaMap[ut.id as string]?.renderUrl ?? null,
    floorplan_url: mediaMap[ut.id as string]?.floorplanUrl ?? null,
  }));
}

export default async function AdminUnitTypesPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const data = await getProjectData(projectSlug);
  if (!data) notFound();

  const unitTypes = await getUnitTypesWithMedia(data.project.id);

  return (
    <UnitTypesManager
      projectSlug={projectSlug}
      initialUnitTypes={unitTypes}
    />
  );
}
