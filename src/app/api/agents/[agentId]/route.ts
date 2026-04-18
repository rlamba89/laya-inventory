import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// PATCH /api/agents/[agentId] — rename/edit agent
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const body = await req.json();
  const supabase = createAdminClient();

  const update: Record<string, unknown> = {};
  if (typeof body?.name === "string") {
    const name = body.name.trim();
    if (!name) return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    update.name = name;
  }
  if (body?.notes !== undefined) {
    update.notes = typeof body.notes === "string" ? body.notes.trim() || null : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabase.from("agents").update(update).eq("id", agentId);
  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/agents/[agentId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase.from("agents").delete().eq("id", agentId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// GET /api/agents/[agentId] — agent detail with assigned units grouped by project
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const supabase = createAdminClient();

  const { data: agent, error: agentErr } = await supabase
    .from("agents")
    .select("id, name, notes, created_at")
    .eq("id", agentId)
    .single();

  if (agentErr || !agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { data: units } = await supabase
    .from("units")
    .select(`
      id, unit_number, label, status, project_id,
      project:projects(id, slug, name, unit_label_short)
    `)
    .eq("agent_id", agentId)
    .order("unit_number");

  return NextResponse.json({ agent, units: units ?? [] });
}
