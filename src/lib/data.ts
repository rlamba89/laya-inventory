import { Townhouse, TownhouseStatus, Project, GroupType, Group, ProjectBranding, UnitType } from "./types";
import { connection } from "next/server";

// ============================================
// Supabase Client Helper
// ============================================

async function getSupabaseClient() {
  // Ensure dynamic rendering — prevents Next.js from caching Supabase fetch calls
  await connection();
  const { createServerClient: _createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Component */ }
        },
      },
    }
  );
}

// ============================================
// Project Data
// ============================================

export interface ProjectData {
  project: Project;
  groupTypes: GroupType[];
  groups: Group[];
}

export async function getProjectData(slug: string): Promise<ProjectData | null> {
  const supabase = await getSupabaseClient();

  const { data: projectRow } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .limit(1);

  if (!projectRow || projectRow.length === 0) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = projectRow[0] as any;

  const project: Project = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    location: p.location,
    description: p.description,
    branding: (p.branding ?? {}) as ProjectBranding,
    siteplan_image_url: p.siteplan_image_url,
    siteplan_width: p.siteplan_width,
    siteplan_height: p.siteplan_height,
    unit_label: p.unit_label,
    unit_label_short: p.unit_label_short,
    currency_code: p.currency_code,
    currency_symbol: p.currency_symbol,
    is_active: p.is_active,
  };

  // Fetch group types
  const { data: gtRows } = await supabase
    .from("group_types")
    .select("*")
    .eq("project_id", project.id)
    .order("display_order");

  const groupTypes: GroupType[] = (gtRows ?? []).map((gt: Record<string, unknown>) => ({
    id: gt.id as string,
    project_id: gt.project_id as string,
    name: gt.name as string,
    slug: gt.slug as string,
    display_order: gt.display_order as number,
    is_filterable: gt.is_filterable as boolean,
  }));

  // Fetch groups
  const { data: gRows } = await supabase
    .from("groups")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order");

  const groups: Group[] = (gRows ?? []).map((g: Record<string, unknown>) => ({
    id: g.id as string,
    project_id: g.project_id as string,
    group_type_id: g.group_type_id as string,
    parent_id: (g.parent_id as string) ?? null,
    name: g.name as string,
    short_name: (g.short_name as string) ?? null,
    sort_order: g.sort_order as number,
    release_status: g.release_status as "unreleased" | "coming_soon" | "now_selling" | "sold_out",
    visible_to_clients: g.visible_to_clients as boolean,
    release_date: (g.release_date as string) ?? null,
    metadata: (g.metadata ?? {}) as Record<string, unknown>,
  }));

  return { project, groupTypes, groups };
}

export async function getProjectList(): Promise<Pick<Project, "slug" | "name" | "tagline" | "location" | "unit_label">[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("slug, name, tagline, location, unit_label")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

// ============================================
// Unit Types
// ============================================

export async function getUnitTypes(projectSlug: string): Promise<UnitType[]> {
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
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order");

  if (!unitTypes) return [];

  return unitTypes.map((ut: Record<string, unknown>): UnitType => ({
    id: ut.id as string,
    project_id: ut.project_id as string,
    code: ut.code as string,
    name: (ut.name as string) ?? null,
    beds: (ut.beds as number) ?? null,
    baths: (ut.baths as number) ?? null,
    cars: (ut.cars as number) ?? null,
    description: (ut.description as string) ?? null,
  }));
}

// ============================================
// Townhouse Data (legacy format for backward compatibility)
// ============================================

export async function getTownhouses(projectSlug?: string): Promise<Townhouse[]> {
  const supabase = await getSupabaseClient();

  // Find project by slug, or fall back to first active project
  let projectQuery = supabase.from("projects").select("id").eq("is_active", true);
  if (projectSlug) {
    projectQuery = projectQuery.eq("slug", projectSlug);
  }
  const { data: projects } = await projectQuery.limit(1);

  if (!projects || projects.length === 0) return [];
  const projectId = projects[0].id;

  // Fetch units with prices and unit type
  const { data: units, error } = await supabase
    .from("units")
    .select(`
      *,
      unit_type:unit_types(id, code),
      current_price:unit_prices(price_min, price_max, display_text)
    `)
    .eq("project_id", projectId)
    .eq("unit_prices.is_current", true)
    .order("unit_number");

  if (error || !units) return [];

  // Batch-fetch render media for all unit types (for siteplan hover)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unitTypeIds = [...new Set(units.map((u: any) => {
    const ut = Array.isArray(u.unit_type) ? u.unit_type[0] : u.unit_type;
    return ut?.id;
  }).filter(Boolean))] as string[];

  const renderMap = new Map<string, string>();
  if (unitTypeIds.length > 0) {
    const { data: renderMedia } = await supabase
      .from("media")
      .select("unit_type_id, url")
      .in("unit_type_id", unitTypeIds)
      .eq("media_type", "render")
      .order("sort_order");

    for (const m of renderMedia ?? []) {
      if (!renderMap.has(m.unit_type_id)) {
        renderMap.set(m.unit_type_id, m.url);
      }
    }
  }

  // Fetch unit-group assignments with group details
  const unitIds = units.map((u: { id: string }) => u.id);
  const { data: unitGroupRows } = await supabase
    .from("unit_groups")
    .select(`
      unit_id,
      group:groups(id, name, group_type:group_types(slug))
    `)
    .in("unit_id", unitIds);

  // Build a lookup: unit_id -> { stage name, area name }
  const unitGroupMap = new Map<string, { stage: string; area: string }>();
  if (unitGroupRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of unitGroupRows as any[]) {
      const group = Array.isArray(row.group) ? row.group[0] : row.group;
      if (!group) continue;
      const groupType = Array.isArray(group.group_type) ? group.group_type[0] : group.group_type;
      if (!groupType) continue;

      const existing = unitGroupMap.get(row.unit_id) ?? { stage: "", area: "" };
      if (groupType.slug === "stage") {
        existing.stage = group.name;
      } else if (groupType.slug === "area") {
        existing.area = group.name;
      }
      unitGroupMap.set(row.unit_id, existing);
    }
  }

  // Convert to legacy Townhouse format for backward compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return units.map((u: any): Townhouse => {
    const price = Array.isArray(u.current_price) ? u.current_price[0] : u.current_price;
    const unitType = Array.isArray(u.unit_type) ? u.unit_type[0] : u.unit_type;
    const groupInfo = unitGroupMap.get(u.id) ?? { stage: "", area: "" };

    // Parse stage number from "Stage 1" -> 1
    const stageNum = parseInt(groupInfo.stage.replace(/\D/g, "")) || 0;

    return {
      id: u.unit_number,
      stg: stageNum,
      area: groupInfo.area,
      desc: u.label,
      type: unitType?.code ?? "",
      beds: u.beds,
      baths: u.baths,
      cars: u.cars,
      gI: u.ground_internal ?? 0,
      gG: u.ground_garage ?? 0,
      uI: u.upper_internal ?? 0,
      uB: u.upper_balcony ?? 0,
      pat: u.patio ?? 0,
      tot: u.total_area ?? 0,
      eF: u.front_yard ?? 0,
      eB: u.back_yard ?? 0,
      lot: u.lot_size ?? 0,
      price: price?.display_text ?? "N/A",
      pMin: price?.price_min ?? 0,
      pMax: price?.price_max ?? 0,
      status: u.status as TownhouseStatus,
      hotspot_x: u.hotspot_x ?? null,
      hotspot_y: u.hotspot_y ?? null,
      renderUrl: unitType?.id ? (renderMap.get(unitType.id) ?? null) : null,
      unitTypeId: unitType?.id ?? null,
    };
  });
}

export async function updateTownhouseStatus(id: number, status: TownhouseStatus): Promise<boolean> {
  const supabase = await getSupabaseClient();

  // Find unit by unit_number
  const { data: matchedUnits } = await supabase
    .from("units")
    .select("id, status")
    .eq("unit_number", id)
    .limit(1);

  if (!matchedUnits || matchedUnits.length === 0) return false;
  const unit = matchedUnits[0];

  const oldStatus = unit.status;

  const { error } = await supabase
    .from("units")
    .update({ status })
    .eq("id", unit.id);

  if (error) return false;

  // Log the status change
  await supabase.from("status_audit_log").insert({
    unit_id: unit.id,
    old_status: oldStatus,
    new_status: status,
  });

  return true;
}

// ============================================
// Admin Data Fetching
// ============================================

export interface AdminUnit {
  unit_number: number;
  label: string;
  beds: number;
  baths: number;
  status: string;
  stage: string;
  area: string;
  unit_type_id: string | null;
  unit_type_code: string | null;
  current_price: {
    price_min: number;
    price_max: number;
    display_text: string | null;
    price_type: string;
  } | null;
}

export async function getAdminUnits(projectSlug: string): Promise<AdminUnit[]> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .single();

  if (!project) return [];

  const { data: units } = await supabase
    .from("units")
    .select(`
      unit_number, label, beds, baths, status, unit_type_id,
      unit_type:unit_types(code),
      current_price:unit_prices(price_min, price_max, display_text, price_type)
    `)
    .eq("project_id", project.id)
    .eq("unit_prices.is_current", true)
    .order("unit_number");

  if (!units) return [];

  // Get unit groups for stage/area names
  const { data: allUnits } = await supabase
    .from("units")
    .select("id, unit_number")
    .eq("project_id", project.id);

  const unitIdMap = new Map((allUnits ?? []).map((u: { id: string; unit_number: number }) => [u.id, u.unit_number]));
  const unitIds = (allUnits ?? []).map((u: { id: string }) => u.id);

  const { data: unitGroupRows } = await supabase
    .from("unit_groups")
    .select(`unit_id, group:groups(name, group_type:group_types(slug))`)
    .in("unit_id", unitIds);

  const unitGroupMap = new Map<number, { stage: string; area: string }>();
  if (unitGroupRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of unitGroupRows as any[]) {
      const group = Array.isArray(row.group) ? row.group[0] : row.group;
      if (!group) continue;
      const groupType = Array.isArray(group.group_type) ? group.group_type[0] : group.group_type;
      if (!groupType) continue;
      const unitNum = unitIdMap.get(row.unit_id);
      if (unitNum == null) continue;
      const existing = unitGroupMap.get(unitNum) ?? { stage: "", area: "" };
      if (groupType.slug === "stage") existing.stage = group.name;
      else if (groupType.slug === "area") existing.area = group.name;
      unitGroupMap.set(unitNum, existing);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return units.map((u: any): AdminUnit => {
    const price = Array.isArray(u.current_price) ? u.current_price[0] : u.current_price;
    const unitType = Array.isArray(u.unit_type) ? u.unit_type[0] : u.unit_type;
    const groupInfo = unitGroupMap.get(u.unit_number) ?? { stage: "", area: "" };
    return {
      unit_number: u.unit_number,
      label: u.label,
      beds: u.beds,
      baths: u.baths,
      status: u.status,
      stage: groupInfo.stage,
      area: groupInfo.area,
      unit_type_id: u.unit_type_id ?? null,
      unit_type_code: unitType?.code ?? null,
      current_price: price ?? null,
    };
  });
}

// ============================================
// Hotspot Data (for siteplan calibration)
// ============================================

export interface HotspotUnit {
  unit_number: number;
  label: string;
  status: string;
  hotspot_x: number | null;
  hotspot_y: number | null;
}

export async function getHotspotUnits(projectSlug: string): Promise<HotspotUnit[]> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .single();

  if (!project) return [];

  const { data: units } = await supabase
    .from("units")
    .select("unit_number, label, status, hotspot_x, hotspot_y")
    .eq("project_id", project.id)
    .order("unit_number");

  if (!units) return [];

  return units.map((u: Record<string, unknown>): HotspotUnit => ({
    unit_number: u.unit_number as number,
    label: u.label as string,
    status: u.status as string,
    hotspot_x: u.hotspot_x as number | null,
    hotspot_y: u.hotspot_y as number | null,
  }));
}
