"use client";

import { useFilters } from "@/hooks/useFilters";
import { useProject } from "@/providers/ProjectProvider";
import { useAppState } from "@/providers/AppStateProvider";
import { groupByStageAndArea } from "@/lib/utils";
import { StageGroup } from "./StageGroup";
import { StageTimeline } from "./StageTimeline";
import { StageNav } from "./StageNav";

export function CardGrid() {
  const filtered = useFilters();
  const { project, getStageInfo, stages } = useProject();
  const { viewMode } = useAppState();
  const grouped = groupByStageAndArea(filtered);

  // Derive stage order from project groups
  const stageNumbers = stages
    .map((s) => parseInt(s.name.replace(/\D/g, "")))
    .filter((n) => !isNaN(n));

  let runningIndex = 0;

  return (
    <div className="card-grid">
      {/* Stage timeline - only show if there are configured stages */}
      {stages.length > 0 && <StageTimeline />}

      {/* Quick-jump stage navigation */}
      <StageNav />

      <div className="px-8 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-xl text-stone">No {project.unit_label.toLowerCase()}s match your filters</p>
            <p className="mt-1 text-sm text-stone/70">Try adjusting your filter criteria</p>
          </div>
        ) : (
          stageNumbers.map((stage) => {
            const info = getStageInfo(stage);

            // In client view, hide stages that are not visible (but allow unreleased through for placeholder)
            if (viewMode === "client" && !info.visible_to_clients && info.release_status !== "unreleased") return null;

            const isUnreleasedClient = viewMode === "client" && info.release_status === "unreleased";
            const areas = isUnreleasedClient ? {} : (grouped[stage] || {});
            const count = Object.values(areas).reduce((s, a) => s + a.length, 0);
            const idx = runningIndex;
            runningIndex += count;
            return (
              <StageGroup
                key={stage}
                stage={stage}
                areas={areas}
                startIndex={idx}
                releaseStatus={info.release_status}
                releaseDate={info.release_date}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
