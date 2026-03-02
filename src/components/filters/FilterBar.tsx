"use client";

import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";
import { FilterChip } from "./FilterChip";
import { StatusFilter, BedsFilter, StageFilter } from "@/lib/types";

export function FilterBar() {
  const { filters, viewMode } = useAppState();
  const dispatch = useAppDispatch();

  const setFilter = (payload: Record<string, StatusFilter | BedsFilter | StageFilter>) =>
    dispatch({ type: "SET_FILTER", payload });

  const stickyTop = viewMode === "internal" ? "top-[100px]" : "top-[60px]";

  return (
    <div className={`filter-bar no-print sticky ${stickyTop} z-30 border-b border-sand bg-white/95 px-8 py-4 backdrop-blur-sm`}>
      <div className="flex flex-wrap items-center gap-6">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone">
            Status
          </span>
          <div className="flex gap-1.5">
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

        <div className="h-5 w-px bg-sand" />

        {/* Beds */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone">
            Beds
          </span>
          <div className="flex gap-1.5">
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

        <div className="h-5 w-px bg-sand" />

        {/* Stage */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone">
            Stage
          </span>
          <div className="flex gap-1.5">
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
