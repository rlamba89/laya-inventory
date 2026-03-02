"use client";

import { TownhouseStatus } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";

export function StatusBadge({ status }: { status: TownhouseStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  );
}
