import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// PATCH — update stage release status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; groupId: string }> }
) {
  const { projectSlug, groupId } = await params;
  const body = await req.json();
  const { release_status, visible_to_clients, release_date } = body as {
    release_status?: string;
    visible_to_clients?: boolean;
    release_date?: string | null;
  };

  const supabase = createAdminClient();

  // Verify project exists
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .eq("is_active", true)
    .limit(1);

  const project = projects?.[0];
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Verify group belongs to this project
  const { data: groupRows } = await supabase
    .from("groups")
    .select("id, project_id")
    .eq("id", groupId)
    .limit(1);

  const group = groupRows?.[0];
  if (!group || group.project_id !== project.id) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  // Build update payload
  const update: Record<string, unknown> = {};
  if (release_status !== undefined) update.release_status = release_status;
  if (visible_to_clients !== undefined) update.visible_to_clients = visible_to_clients;
  if (release_date !== undefined) update.release_date = release_date;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("groups")
    .update(update)
    .eq("id", groupId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, groupId, ...update });
}
