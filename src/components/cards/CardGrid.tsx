"use client";

import { useFilters } from "@/hooks/useFilters";
import { groupByStageAndArea } from "@/lib/utils";
import { STAGE_ORDER } from "@/lib/constants";
import { StageGroup } from "./StageGroup";

export function CardGrid() {
  const filtered = useFilters();
  const grouped = groupByStageAndArea(filtered);

  let runningIndex = 0;

  return (
    <div className="card-grid px-8 py-8">
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-serif text-xl text-stone">No townhouses match your filters</p>
          <p className="mt-1 text-sm text-stone/70">Try adjusting your filter criteria</p>
        </div>
      ) : (
        STAGE_ORDER.map((stage) => {
          const areas = grouped[stage] || {};
          const count = Object.values(areas).reduce((s, a) => s + a.length, 0);
          const idx = runningIndex;
          runningIndex += count;
          return (
            <StageGroup
              key={stage}
              stage={stage}
              areas={areas}
              startIndex={idx}
            />
          );
        })
      )}
    </div>
  );
}
