import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// POST /api/projects/[projectSlug]/media/upload
// Accepts multipart/form-data with: file, media_type, variant?, unit_id?, unit_type_id?, alt_text?
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const mediaType = formData.get("media_type") as string | null;
  const variant = formData.get("variant") as string | null;
  const unitId = formData.get("unit_id") as string | null;
  const unitTypeId = formData.get("unit_type_id") as string | null;
  const altText = formData.get("alt_text") as string | null;

  if (!file || !mediaType) {
    return NextResponse.json(
      { error: "file and media_type are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Use JPEG, PNG, WebP, or SVG." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum 10MB." },
      { status: 400 }
    );
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

  // Generate storage path: project-media/{projectId}/{mediaType}/{timestamp}-{filename}
  const ext = file.name.split(".").pop() || "png";
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${project.id}/${mediaType}/${timestamp}-${safeName}`;

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("project-media")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("project-media")
    .getPublicUrl(storagePath);

  const publicUrl = publicUrlData.publicUrl;

  // Get current max sort_order for this context
  let sortQuery = supabase
    .from("media")
    .select("sort_order")
    .eq("project_id", project.id)
    .eq("media_type", mediaType)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (unitId) sortQuery = sortQuery.eq("unit_id", unitId);
  if (unitTypeId) sortQuery = sortQuery.eq("unit_type_id", unitTypeId);

  const { data: maxSort } = await sortQuery;
  const nextSort = maxSort && maxSort.length > 0
    ? (maxSort[0] as { sort_order: number }).sort_order + 1
    : 0;

  // Insert media record
  const { data: media, error: insertError } = await supabase
    .from("media")
    .insert({
      project_id: project.id,
      unit_id: unitId || null,
      unit_type_id: unitTypeId || null,
      media_type: mediaType,
      variant: variant || null,
      url: publicUrl,
      alt_text: altText || `${mediaType} - ${file.name.replace(`.${ext}`, "")}`,
      sort_order: nextSort,
    })
    .select()
    .single();

  if (insertError) {
    // Clean up uploaded file
    await supabase.storage.from("project-media").remove([storagePath]);
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ media }, { status: 201 });
}
