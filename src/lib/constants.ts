import { TownhouseStatus } from "./types";

export const STATUS_CONFIG: Record<
  TownhouseStatus,
  { label: string; color: string; bg: string }
> = {
  available: { label: "Available", color: "var(--available-green)", bg: "var(--available-bg)" },
  sold: { label: "Sold", color: "var(--sold-red)", bg: "var(--sold-bg)" },
  negotiation: { label: "Under Negotiation", color: "var(--negotiation-amber)", bg: "var(--negotiation-bg)" },
  hold: { label: "On Hold", color: "var(--hold-blue)", bg: "var(--hold-bg)" },
  unreleased: { label: "Unreleased", color: "var(--charcoal-light)", bg: "var(--sand-light)" },
};
