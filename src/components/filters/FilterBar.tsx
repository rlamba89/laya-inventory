"use client";

import { useMemo } from "react";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";
import { useProject } from "@/providers/ProjectProvider";
import { FilterChip } from "./FilterChip";
import { StatusFilter, BedsFilter, StageFilter } from "@/lib/types";

export function FilterBar() {
  const { filters, viewMode } = useAppState();
  const { stages, getStageInfo } = useProject();
  const dispatch = useAppDispatch();

  const setFilter = (payload: Record<string, StatusFilter | BedsFilter | StageFilter>) =>
    dispatch({ type: "SET_FILTER", payload });

  // Build dynamic stage filter options from project data
  const stageOptions = useMemo((): StageFilter[] => {
    const options: StageFilter[] = ["all"];
    for (const stage of stages) {
      const num = parseInt(stage.name.replace(/\D/g, ""));
      if (isNaN(num)) continue;
      const info = getStageInfo(num);
      // In client view, hide unreleased stages from filter
      if (viewMode === "client" && !info.visible_to_clients) continue;
      if (viewMode === "client" && info.release_status === "unreleased") continue;
      options.push(num as StageFilter);
    }
    return options;
  }, [stages, getStageInfo, viewMode]);

  return (
    <div className="filter-bar no-print sticky z-30 border-b border-sand bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4" style={{ top: "var(--filter-bar-top, 60px)" }}>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        {/* Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-stone sm:text-[10px]">
            Status
          </span>
          <div className="flex gap-1">
            {(["all", "available", "sold", "negotiation", "hold"] as StatusFilter[]).map((s) => (
              <FilterChip
                key={s}
                label={s === "all" ? "All" : s === "negotiation" ? "Negotiating" : s.charAt(0).toUpperCase() + s.slice(1)}
                active={filters.status === s}
                onClick={() => setFilter({ status: s })}
              />
            ))}
          </div>
        </div>

        <div className="hidden h-5 w-px bg-sand sm:block" />

        {/* Beds */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-stone sm:text-[10px]">
            Beds
          </span>
          <div className="flex gap-1">
            {(["all", 3, 4] as BedsFilter[]).map((b) => (
              <FilterChip
                key={String(b)}
                label={b === "all" ? "All" : `${b} Bed`}
                active={filters.beds === b}
                onClick={() => setFilter({ beds: b })}
              />
            ))}
          </div>
        </div>

        {stageOptions.length > 1 && (
          <>
            <div className="hidden h-5 w-px bg-sand sm:block" />

            {/* Stage */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-stone sm:text-[10px]">
                Stage
              </span>
              <div className="flex gap-1">
                {stageOptions.map((s) => (
                  <FilterChip
                    key={String(s)}
                    label={s === "all" ? "All" : `Stage ${s}`}
                    active={filters.stage === s}
                    onClick={() => setFilter({ stage: s })}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
