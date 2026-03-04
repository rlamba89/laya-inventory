import { NextRequest, NextResponse } from "next/server";
import { updateTownhouseStatus } from "@/lib/data";
import { TownhouseStatus } from "@/lib/types";

// PATCH — update unit status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  await params; // consume params

  const body = await req.json();
  const { id, status } = body as { id: number; status: TownhouseStatus };

  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  const validStatuses: TownhouseStatus[] = ["available", "sold", "negotiation", "hold"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const success = await updateTownhouseStatus(id, status);
  if (!success) {
    return NextResponse.json({ error: "Unit not found" }, { status: 404 });
  }

  return NextResponse.json({ id, status, success: true });
}
