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
    <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center rounded-lg bg-warm-white px-2 py-1.5 shadow-sm sm:rounded-xl sm:px-4 sm:py-2"
        >
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
              style={{ backgroundColor: stat.color }}
            />
            <span className="font-sans text-lg font-bold text-charcoal sm:text-2xl">
              {stat.value}
            </span>
          </div>
          <span className="text-[7px] font-semibold uppercase tracking-wider text-stone sm:text-[9px]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
