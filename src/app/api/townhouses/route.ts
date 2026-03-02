import { NextRequest, NextResponse } from "next/server";
import { getTownhouses, updateTownhouseStatus } from "@/lib/data";
import { TownhouseStatus } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getTownhouses());
}

export async function PATCH(req: NextRequest) {
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
    return NextResponse.json({ error: "Townhouse not found" }, { status: 404 });
  }

  return NextResponse.json({ id, status, success: true });
}
