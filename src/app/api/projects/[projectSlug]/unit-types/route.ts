import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/projects/[projectSlug]/unit-types
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
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

  // Fetch unit types with their render and floorplan media
  const { data: unitTypes, error } = await supabase
    .from("unit_types")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch render and floorplan media for all unit types
  const typeIds = (unitTypes ?? []).map((ut: { id: string }) => ut.id);
  let mediaMap: Record<string, { renderUrl: string | null; floorplanUrl: string | null }> = {};

  if (typeIds.length > 0) {
    const { data: media } = await supabase
      .from("media")
      .select("unit_type_id, media_type, url")
      .in("unit_type_id", typeIds)
      .in("media_type", ["render", "floorplan"])
      .order("sort_order");

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
  }

  const result = (unitTypes ?? []).map((ut: Record<string, unknown>) => ({
    ...ut,
    render_url: mediaMap[ut.id as string]?.renderUrl ?? null,
    floorplan_url: mediaMap[ut.id as string]?.floorplanUrl ?? null,
  }));

  return NextResponse.json({ unitTypes: result });
}

// POST /api/projects/[projectSlug]/unit-types
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const body = await req.json();
  const { code, name, beds, baths, cars, description } = body;

  if (!code) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

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

  // Get next sort_order
  const { data: existing } = await supabase
    .from("unit_types")
    .select("sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSort = ((existing?.[0] as { sort_order?: number })?.sort_order ?? 0) + 1;

  const { data: unitType, error } = await supabase
    .from("unit_types")
    .insert({
      project_id: project.id,
      code,
      name: name || null,
      beds: beds ?? null,
      baths: baths ?? null,
      cars: cars ?? null,
      description: description || null,
      sort_order: nextSort,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ unitType }, { status: 201 });
}

// PATCH /api/projects/[projectSlug]/unit-types?id=...
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const url = new URL(req.url);
  const typeId = url.searchParams.get("id");

  if (!typeId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

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

  // Verify unit type belongs to this project
  const { data: existing } = await supabase
    .from("unit_types")
    .select("id")
    .eq("id", typeId)
    .eq("project_id", project.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Unit type not found" }, { status: 404 });
  }

  const update: Record<string, unknown> = {};
  if (body.code !== undefined) update.code = body.code;
  if (body.name !== undefined) update.name = body.name || null;
  if (body.beds !== undefined) update.beds = body.beds;
  if (body.baths !== undefined) update.baths = body.baths;
  if (body.cars !== undefined) update.cars = body.cars;
  if (body.description !== undefined) update.description = body.description || null;
  if (body.sort_order !== undefined) update.sort_order = body.sort_order;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data: unitType, error } = await supabase
    .from("unit_types")
    .update(update)
    .eq("id", typeId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ unitType });
}

// DELETE /api/projects/[projectSlug]/unit-types?id=...
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const url = new URL(req.url);
  const typeId = url.searchParams.get("id");

  if (!typeId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

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

  // Verify unit type belongs to this project
  const { data: existing } = await supabase
    .from("unit_types")
    .select("id")
    .eq("id", typeId)
    .eq("project_id", project.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Unit type not found" }, { status: 404 });
  }

  // Check if any units reference this type
  const { count } = await supabase
    .from("units")
    .select("id", { count: "exact", head: true })
    .eq("unit_type_id", typeId);

  if (count && count > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${count} unit(s) are assigned this type. Reassign them first.` },
      { status: 409 }
    );
  }

  // Delete associated media
  const { data: mediaRows } = await supabase
    .from("media")
    .select("id, url")
    .eq("unit_type_id", typeId);

  for (const m of mediaRows ?? []) {
    if (m.url?.includes("/storage/v1/object/public/")) {
      const storagePath = m.url.split("/storage/v1/object/public/")[1];
      if (storagePath) {
        const [bucket, ...pathParts] = storagePath.split("/");
        await supabase.storage.from(bucket).remove([pathParts.join("/")]);
      }
    }
  }

  if (mediaRows && mediaRows.length > 0) {
    await supabase
      .from("media")
      .delete()
      .eq("unit_type_id", typeId);
  }

  const { error } = await supabase
    .from("unit_types")
    .delete()
    .eq("id", typeId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
