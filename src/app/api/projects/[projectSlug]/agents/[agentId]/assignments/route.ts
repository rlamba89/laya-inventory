import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function resolveProject(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

// POST — assign multiple units to this agent
// body: { unitNumbers: number[] }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; agentId: string }> }
) {
  const { projectSlug, agentId } = await params;
  const body = await req.json();
  const unitNumbers: number[] = Array.isArray(body?.unitNumbers) ? body.unitNumbers : [];

  if (unitNumbers.length === 0) {
    return NextResponse.json({ error: "unitNumbers required" }, { status: 400 });
  }

  const project = await resolveProject(projectSlug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const supabase = createAdminClient();

  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("id", agentId)
    .single();
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("units")
    .update({ agent_id: agentId })
    .eq("project_id", project.id)
    .in("unit_number", unitNumbers);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, assigned: unitNumbers.length });
}

// DELETE — unassign units from this agent
// body: { unitNumbers: number[] }
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; agentId: string }> }
) {
  const { projectSlug, agentId } = await params;
  const body = await req.json().catch(() => ({}));
  const unitNumbers: number[] = Array.isArray(body?.unitNumbers) ? body.unitNumbers : [];

  const project = await resolveProject(projectSlug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("units")
    .update({ agent_id: null })
    .eq("project_id", project.id)
    .eq("agent_id", agentId);

  if (unitNumbers.length > 0) {
    query = query.in("unit_number", unitNumbers);
  }

  const { error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
