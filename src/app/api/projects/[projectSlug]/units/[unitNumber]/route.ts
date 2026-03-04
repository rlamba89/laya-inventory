import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/projects/[projectSlug]/units/[unitNumber] — full unit details
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; unitNumber: string }> }
) {
  const { projectSlug, unitNumber } = await params;
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { data: unitRows } = await supabase
    .from("units")
    .select(`
      *,
      unit_type:unit_types(id, code, name)
    `)
    .eq("project_id", project.id)
    .eq("unit_number", parseInt(unitNumber))
    .limit(1);

  const unit = unitRows?.[0];
  if (!unit) {
    return NextResponse.json({ error: "Unit not found" }, { status: 404 });
  }

  // Fetch group assignments
  const { data: unitGroupRows } = await supabase
    .from("unit_groups")
    .select(`group_id, group:groups(id, name, group_type_id, group_type:group_types(slug))`)
    .eq("unit_id", unit.id);

  const groups: Record<string, string> = {};
  if (unitGroupRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of unitGroupRows as any[]) {
      const group = Array.isArray(row.group) ? row.group[0] : row.group;
      if (!group) continue;
      const groupType = Array.isArray(group.group_type) ? group.group_type[0] : group.group_type;
      if (groupType?.slug) {
        groups[groupType.slug] = group.id;
      }
    }
  }

  return NextResponse.json({ unit, groups });
}

// PATCH /api/projects/[projectSlug]/units/[unitNumber]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; unitNumber: string }> }
) {
  const { projectSlug, unitNumber } = await params;
  const body = await req.json();

  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Find unit by unit_number
  const { data: unitRows } = await supabase
    .from("units")
    .select("id, status")
    .eq("project_id", project.id)
    .eq("unit_number", parseInt(unitNumber))
    .limit(1);

  const unit = unitRows?.[0];
  if (!unit) {
    return NextResponse.json({ error: "Unit not found" }, { status: 404 });
  }

  // --- Update unit fields ---
  const UNIT_FIELDS = [
    "unit_type_id", "label", "status", "beds", "baths", "cars",
    "ground_internal", "ground_garage", "upper_internal", "upper_balcony",
    "patio", "total_area", "front_yard", "back_yard", "lot_size", "notes",
  ];

  const update: Record<string, unknown> = {};
  for (const field of UNIT_FIELDS) {
    if (body[field] !== undefined) {
      update[field] = body[field] === "" ? null : body[field];
    }
  }
  // Special case: unit_type_id empty string → null
  if (update.unit_type_id === "") update.unit_type_id = null;

  if (Object.keys(update).length > 0) {
    const { error } = await supabase
      .from("units")
      .update(update)
      .eq("id", unit.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log status change
    if (body.status && body.status !== unit.status) {
      await supabase.from("status_audit_log").insert({
        unit_id: unit.id,
        old_status: unit.status,
        new_status: body.status,
      });
    }
  }

  // --- Update group assignments (stage, area) ---
  if (body.groups && typeof body.groups === "object") {
    // body.groups = { stage: "group-uuid", area: "group-uuid" }
    // For each group type slug, reassign the unit
    for (const [typeSlug, newGroupId] of Object.entries(body.groups)) {
      if (!newGroupId) continue;

      // Find the group_type by slug for this project
      const { data: groupType } = await supabase
        .from("group_types")
        .select("id")
        .eq("project_id", project.id)
        .eq("slug", typeSlug)
        .single();

      if (!groupType) continue;

      // Find all groups of this type for this project
      const { data: groupsOfType } = await supabase
        .from("groups")
        .select("id")
        .eq("project_id", project.id)
        .eq("group_type_id", groupType.id);

      const groupIdsOfType = (groupsOfType ?? []).map((g: { id: string }) => g.id);

      if (groupIdsOfType.length === 0) continue;

      // Remove existing assignment for this group type
      await supabase
        .from("unit_groups")
        .delete()
        .eq("unit_id", unit.id)
        .in("group_id", groupIdsOfType);

      // Insert new assignment
      await supabase
        .from("unit_groups")
        .insert({ unit_id: unit.id, group_id: newGroupId as string });
    }
  }

  return NextResponse.json({ success: true, unit_number: parseInt(unitNumber) });
}
