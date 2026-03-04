import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MediaType } from "@/lib/types";

// GET /api/projects/[projectSlug]/media?unit_type_id=...&unit_id=...&media_type=...
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const url = new URL(_req.url);
  const unitTypeId = url.searchParams.get("unit_type_id");
  const unitId = url.searchParams.get("unit_id");
  const mediaType = url.searchParams.get("media_type") as MediaType | null;

  const supabase = createAdminClient();

  // Resolve project
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  let query = supabase
    .from("media")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order")
    .order("created_at");

  if (unitTypeId) query = query.eq("unit_type_id", unitTypeId);
  if (unitId) query = query.eq("unit_id", unitId);
  if (mediaType) query = query.eq("media_type", mediaType);

  const { data: media, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ media: media ?? [] });
}

// POST /api/projects/[projectSlug]/media
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const body = await req.json();
  const {
    unit_id,
    unit_type_id,
    media_type,
    variant,
    url: mediaUrl,
    alt_text,
    sort_order,
  } = body;

  if (!media_type || !mediaUrl) {
    return NextResponse.json(
      { error: "media_type and url are required" },
      { status: 400 }
    );
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

  const { data: media, error } = await supabase
    .from("media")
    .insert({
      project_id: project.id,
      unit_id: unit_id || null,
      unit_type_id: unit_type_id || null,
      media_type,
      variant: variant || null,
      url: mediaUrl,
      alt_text: alt_text || null,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ media }, { status: 201 });
}

// DELETE /api/projects/[projectSlug]/media?id=...
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const url = new URL(req.url);
  const mediaId = url.searchParams.get("id");

  if (!mediaId) {
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

  // Verify media belongs to this project
  const { data: existing } = await supabase
    .from("media")
    .select("id, url")
    .eq("id", mediaId)
    .eq("project_id", project.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  // If it's a Supabase Storage URL, try to delete from storage too
  if (existing.url?.includes("/storage/v1/object/public/")) {
    const storagePath = existing.url.split("/storage/v1/object/public/")[1];
    if (storagePath) {
      const [bucket, ...pathParts] = storagePath.split("/");
      await supabase.storage.from(bucket).remove([pathParts.join("/")]);
    }
  }

  const { error } = await supabase
    .from("media")
    .delete()
    .eq("id", mediaId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
