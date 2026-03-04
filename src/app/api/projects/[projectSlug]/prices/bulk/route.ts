import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// PATCH — bulk price update
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params;
  const body = await req.json();
  const { unit_numbers, adjustment_type, adjustment_value, change_reason, changed_by } = body as {
    unit_numbers: number[];
    adjustment_type: "percent" | "fixed";
    adjustment_value: number;
    change_reason?: string;
    changed_by?: string;
  };

  if (!unit_numbers?.length || !adjustment_type || adjustment_value == null) {
    return NextResponse.json(
      { error: "unit_numbers, adjustment_type, and adjustment_value are required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Resolve project
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .limit(1);

  const project = projects?.[0] as { id: string } | undefined;
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Get units by unit_numbers
  const { data: units } = await supabase
    .from("units")
    .select("id, unit_number")
    .eq("project_id", project.id)
    .in("unit_number", unit_numbers);

  if (!units?.length) {
    return NextResponse.json({ error: "No matching units found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unitIds = (units as any[]).map((u) => u.id as string);

  // Get current prices for these units
  const { data: currentPrices } = await supabase
    .from("unit_prices")
    .select("*")
    .in("unit_id", unitIds)
    .eq("is_current", true);

  if (!currentPrices?.length) {
    return NextResponse.json({ error: "No current prices found for selected units" }, { status: 404 });
  }

  const now = new Date().toISOString();

  // Mark current prices as not current
  await supabase
    .from("unit_prices")
    .update({ is_current: false, effective_to: now })
    .in("unit_id", unitIds)
    .eq("is_current", true);

  // Calculate and insert new prices
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPrices = (currentPrices as any[]).map((p) => {
    let newMin: number;
    let newMax: number;

    if (adjustment_type === "percent") {
      const factor = 1 + adjustment_value / 100;
      newMin = Math.round(p.price_min * factor);
      newMax = Math.round(p.price_max * factor);
    } else {
      newMin = p.price_min + adjustment_value;
      newMax = p.price_max + adjustment_value;
    }

    return {
      unit_id: p.unit_id,
      price_type: p.price_type,
      price_min: newMin,
      price_max: newMax,
      display_text: null,
      is_current: true,
      changed_by: changed_by ?? null,
      change_reason: change_reason ?? `Bulk ${adjustment_type} adjustment: ${adjustment_type === "percent" ? `${adjustment_value}%` : adjustment_value}`,
    };
  });

  const { data: inserted, error } = await supabase
    .from("unit_prices")
    .insert(newPrices)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: inserted?.length ?? 0, prices: inserted });
}
