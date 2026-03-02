import { kv } from "@vercel/kv";
import baseTownhouses from "@/data/townhouses.json";
import { Townhouse, TownhouseStatus } from "./types";

const KV_KEY = "townhouse_statuses";

export async function getTownhouses(): Promise<Townhouse[]> {
  const overrides: Record<string, TownhouseStatus> =
    (await kv.get<Record<string, TownhouseStatus>>(KV_KEY)) ?? {};

  return (baseTownhouses as Townhouse[]).map((th) => {
    const override = overrides[String(th.id)];
    return override ? { ...th, status: override } : th;
  });
}

export async function updateTownhouseStatus(id: number, status: TownhouseStatus): Promise<boolean> {
  const exists = baseTownhouses.some((th) => th.id === id);
  if (!exists) return false;

  const overrides: Record<string, TownhouseStatus> =
    (await kv.get<Record<string, TownhouseStatus>>(KV_KEY)) ?? {};

  overrides[String(id)] = status;
  await kv.set(KV_KEY, overrides);
  return true;
}
