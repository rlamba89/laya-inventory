"use client";

import { Townhouse } from "@/lib/types";
import { AREA_ORDER } from "@/lib/constants";
import { AreaGroup } from "./AreaGroup";

interface StageGroupProps {
  stage: number;
  areas: Record<string, Townhouse[]>;
  startIndex: number;
}

export function StageGroup({ stage, areas, startIndex }: StageGroupProps) {
  const totalCount = Object.values(areas).reduce((sum, arr) => sum + arr.length, 0);
  if (totalCount === 0) return null;

  let runningIndex = startIndex;

  return (
    <section className="mb-10">
      <div className="mb-5 flex items-center gap-3">
        <h3 className="font-serif text-2xl font-semibold text-charcoal">
          Stage {stage}
        </h3>
        <span className="rounded-full bg-sand-light px-3 py-0.5 text-[11px] font-semibold text-charcoal-mid">
          {totalCount} townhouses
        </span>
      </div>
      {AREA_ORDER.map((area) => {
        const areaData = areas[area] || [];
        if (areaData.length === 0) return null;
        const idx = runningIndex;
        runningIndex += areaData.length;
        return (
          <AreaGroup
            key={area}
            area={area}
            townhouses={areaData}
            startIndex={idx}
          />
        );
      })}
    </section>
  );
}
