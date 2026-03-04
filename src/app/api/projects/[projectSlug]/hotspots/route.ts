import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// PATCH — update a single unit's hotspot position
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const body = await req.json();
  const { unit_number, hotspot_x, hotspot_y } = body as {
    unit_number: number;
    hotspot_x: number | null;
    hotspot_y: number | null;
  };

  if (unit_number == null) {
    return NextResponse.json({ error: "unit_number is required" }, { status: 400 });
  }

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

  const { error } = await supabase
    .from("units")
    .update({ hotspot_x, hotspot_y })
    .eq("project_id", project.id)
    .eq("unit_number", unit_number);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, unit_number, hotspot_x, hotspot_y });
}

// DELETE — clear all hotspot positions for the project
export async function DELETE(
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

  const { error } = await supabase
    .from("units")
    .update({ hotspot_x: null, hotspot_y: null })
    .eq("project_id", project.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PUT — update siteplan image for the project
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
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

  // Upload to storage
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${project.id}/siteplan/${Date.now()}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("project-media")
    .upload(storagePath, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from("project-media")
    .getPublicUrl(storagePath);

  // Get image dimensions from formData (client reads them before uploading)
  const width = parseInt(formData.get("width") as string) || null;
  const height = parseInt(formData.get("height") as string) || null;

  // Update project record
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      siteplan_image_url: publicUrlData.publicUrl,
      siteplan_width: width,
      siteplan_height: height,
    })
    .eq("id", project.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    siteplan_image_url: publicUrlData.publicUrl,
    siteplan_width: width,
    siteplan_height: height,
  });
}
