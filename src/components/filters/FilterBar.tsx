"use client";

import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";
import { FilterChip } from "./FilterChip";
import { StatusFilter, BedsFilter, StageFilter } from "@/lib/types";

export function FilterBar() {
  const { filters, viewMode } = useAppState();
  const dispatch = useAppDispatch();

  const setFilter = (payload: Record<string, StatusFilter | BedsFilter | StageFilter>) =>
    dispatch({ type: "SET_FILTER", payload });

  const stickyTop = "top-[60px]";

  return (
    <div className={`filter-bar no-print sticky ${stickyTop} z-30 border-b border-sand bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4`}>
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

        <div className="hidden h-5 w-px bg-sand sm:block" />

        {/* Stage */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-stone sm:text-[10px]">
            Stage
          </span>
          <div className="flex gap-1">
            {(["all", 1, 2, 3] as StageFilter[]).map((s) => (
              <FilterChip
                key={String(s)}
                label={s === "all" ? "All" : `Stage ${s}`}
                active={filters.stage === s}
                onClick={() => setFilter({ stage: s })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
