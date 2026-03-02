import { TownhouseStatus } from "./types";

export const STATUS_CONFIG: Record<
  TownhouseStatus,
  { label: string; color: string; bg: string }
> = {
  available: { label: "Available", color: "var(--available-green)", bg: "var(--available-bg)" },
  sold: { label: "Sold", color: "var(--sold-red)", bg: "var(--sold-bg)" },
  negotiation: { label: "Under Negotiation", color: "var(--negotiation-amber)", bg: "var(--negotiation-bg)" },
  hold: { label: "On Hold", color: "var(--hold-blue)", bg: "var(--hold-bg)" },
};

export const STAGE_ORDER = [1, 2, 3] as const;

export const AREA_ORDER = [
  "Streetside",
  "Shopside",
  "Inner Circle",
  "Reserve Outlook",
  "Eastern Side",
] as const;

export const STAGE_AREAS: Record<number, string[]> = {
  1: ["Streetside", "Shopside", "Inner Circle"],
  2: ["Inner Circle"],
  3: ["Streetside", "Inner Circle", "Reserve Outlook", "Eastern Side"],
};
