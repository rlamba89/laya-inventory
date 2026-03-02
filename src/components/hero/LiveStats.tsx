"use client";

import { useAppState } from "@/providers/AppStateProvider";
import { countByStatus } from "@/lib/utils";

export function LiveStats() {
  const { townhouses } = useAppState();
  const counts = countByStatus(townhouses);

  const stats = [
    { label: "Available", value: counts.available, color: "var(--available-green)" },
    { label: "Sold", value: counts.sold, color: "var(--sold-red)" },
    { label: "Negotiating", value: counts.negotiation, color: "var(--negotiation-amber)" },
    { label: "Total", value: townhouses.length, color: "var(--gold)" },
  ];

  return (
    <div className="flex items-center gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center rounded-xl bg-charcoal-mid/40 px-4 py-2 backdrop-blur-sm"
        >
          <span
            className="font-sans text-2xl font-bold"
            style={{ color: stat.color }}
          >
            {stat.value}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-sand/70">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
