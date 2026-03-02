"use client";

import { useCallback } from "react";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";

export function useCompare() {
  const { compareIds, townhouses } = useAppState();
  const dispatch = useAppDispatch();

  const toggle = useCallback(
    (id: number) => dispatch({ type: "TOGGLE_COMPARE", payload: id }),
    [dispatch]
  );

  const clear = useCallback(
    () => dispatch({ type: "CLEAR_COMPARE" }),
    [dispatch]
  );

  const isSelected = useCallback(
    (id: number) => compareIds.includes(id),
    [compareIds]
  );

  const selectedTownhouses = townhouses.filter((th) =>
    compareIds.includes(th.id)
  );

  return {
    compareIds,
    selectedTownhouses,
    toggle,
    clear,
    isSelected,
    canAdd: compareIds.length < 3,
    canCompare: compareIds.length >= 2,
  };
}
