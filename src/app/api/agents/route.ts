import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/agents — list all agents (with optional ?withCounts=true)
export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const withCounts = req.nextUrl.searchParams.get("withCounts") === "true";

  const { data: agents, error } = await supabase
    .from("agents")
    .select("id, name, notes, created_at")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!withCounts) {
    return NextResponse.json({ agents: agents ?? [] });
  }

  const { data: counts } = await supabase
    .from("units")
    .select("agent_id")
    .not("agent_id", "is", null);

  const countMap = new Map<string, number>();
  for (const row of counts ?? []) {
    const id = row.agent_id as string;
    countMap.set(id, (countMap.get(id) ?? 0) + 1);
  }

  return NextResponse.json({
    agents: (agents ?? []).map((a) => ({ ...a, assigned_count: countMap.get(a.id) ?? 0 })),
  });
}

// POST /api/agents — create agent
export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : null;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("agents")
    .insert({ name, notes })
    .select("id, name, notes, created_at")
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ agent: data }, { status: 201 });
}
