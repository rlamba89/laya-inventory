import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function resolveProjectAndUnit(projectSlug: string, unitNumber: string) {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .limit(1);

  const project = projects?.[0] as { id: string } | undefined;
  if (!project) return null;

  const { data: units } = await supabase
    .from("units")
    .select("id")
    .eq("project_id", project.id)
    .eq("unit_number", parseInt(unitNumber))
    .limit(1);

  const unit = units?.[0] as { id: string } | undefined;
  if (!unit) return null;

  return { supabase, projectId: project.id, unitId: unit.id };
}

// GET — price history for a unit
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; unitNumber: string }> }
) {
  const { projectSlug, unitNumber } = await params;
  const resolved = await resolveProjectAndUnit(projectSlug, unitNumber);

  if (!resolved) {
    return NextResponse.json({ error: "Project or unit not found" }, { status: 404 });
  }

  const { data: prices, error } = await resolved.supabase
    .from("unit_prices")
    .select("*")
    .eq("unit_id", resolved.unitId)
    .order("effective_from", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(prices);
}

// POST — add new price
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; unitNumber: string }> }
) {
  const { projectSlug, unitNumber } = await params;
  const body = await req.json();
  const { price_min, price_max, display_text, price_type, change_reason, changed_by } = body as {
    price_min: number;
    price_max: number;
    display_text?: string;
    price_type?: string;
    change_reason?: string;
    changed_by?: string;
  };

  if (price_min == null || price_max == null) {
    return NextResponse.json({ error: "price_min and price_max are required" }, { status: 400 });
  }

  const resolved = await resolveProjectAndUnit(projectSlug, unitNumber);
  if (!resolved) {
    return NextResponse.json({ error: "Project or unit not found" }, { status: 404 });
  }

  const { supabase, unitId } = resolved;

  // Mark current prices as not current
  await supabase
    .from("unit_prices")
    .update({ is_current: false, effective_to: new Date().toISOString() })
    .eq("unit_id", unitId)
    .eq("is_current", true);

  // Insert new price
  const { data: newPrice, error } = await supabase
    .from("unit_prices")
    .insert({
      unit_id: unitId,
      price_type: price_type ?? "base",
      price_min,
      price_max,
      display_text: display_text ?? null,
      is_current: true,
      changed_by: changed_by ?? null,
      change_reason: change_reason ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(newPrice, { status: 201 });
}
