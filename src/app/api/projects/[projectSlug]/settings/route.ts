import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// PATCH — update project settings
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const body = await req.json();
  const {
    name,
    tagline,
    location,
    description,
    unit_label,
    unit_label_short,
    currency_symbol,
    currency_code,
    branding,
  } = body as {
    name?: string;
    tagline?: string | null;
    location?: string | null;
    description?: string | null;
    unit_label?: string;
    unit_label_short?: string;
    currency_symbol?: string;
    currency_code?: string;
    branding?: Record<string, unknown>;
  };

  const supabase = createAdminClient();

  // Verify project exists
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .limit(1);

  if (!projects || projects.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const projectId = projects[0].id;

  // Build update object (only include provided fields)
  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (tagline !== undefined) update.tagline = tagline;
  if (location !== undefined) update.location = location;
  if (description !== undefined) update.description = description;
  if (unit_label !== undefined) update.unit_label = unit_label;
  if (unit_label_short !== undefined) update.unit_label_short = unit_label_short;
  if (currency_symbol !== undefined) update.currency_symbol = currency_symbol;
  if (currency_code !== undefined) update.currency_code = currency_code;
  if (branding !== undefined) update.branding = branding;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", projectId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
