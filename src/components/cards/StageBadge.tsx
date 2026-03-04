"use client";

import { ReleaseStatus } from "@/lib/types";

const BADGE_CONFIG: Record<ReleaseStatus, { label: string; className: string } | null> = {
  unreleased: {
    label: "Unreleased",
    className: "bg-stone/10 text-stone border-stone/20",
  },
  coming_soon: {
    label: "Coming Soon",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  now_selling: {
    label: "Now Selling",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse-subtle",
  },
  sold_out: {
    label: "Sold Out",
    className: "bg-stone/10 text-stone border-stone/20",
  },
};

export function StageBadge({ status }: { status: ReleaseStatus }) {
  const config = BADGE_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
    >
      {status === "now_selling" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
