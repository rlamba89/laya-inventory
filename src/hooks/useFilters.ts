"use client";

import { useMemo } from "react";
import { useAppState } from "@/providers/AppStateProvider";
import { Townhouse } from "@/lib/types";

export function useFilters(): Townhouse[] {
  const { townhouses, filters } = useAppState();

  return useMemo(() => {
    return townhouses.filter((th) => {
      if (filters.status !== "all" && th.status !== filters.status) return false;
      if (filters.beds !== "all" && th.beds !== filters.beds) return false;
      if (filters.stage !== "all" && th.stg !== filters.stage) return false;
      return true;
    });
  }, [townhouses, filters]);
}
