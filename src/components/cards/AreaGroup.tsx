"use client";

import { Townhouse } from "@/lib/types";
import { TownhouseCard } from "./TownhouseCard";

interface AreaGroupProps {
  area: string;
  townhouses: Townhouse[];
  startIndex: number;
}

export function AreaGroup({ area, townhouses, startIndex }: AreaGroupProps) {
  if (townhouses.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          {area}
        </h4>
        <span className="text-[10px] text-stone">
          ({townhouses.length})
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
        {townhouses.map((th, i) => (
          <TownhouseCard key={th.id} th={th} index={startIndex + i} />
        ))}
      </div>
    </div>
  );
}
