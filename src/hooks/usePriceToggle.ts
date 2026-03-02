"use client";

import { useCallback } from "react";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";

export function usePriceToggle() {
  const { showPricing, viewMode } = useAppState();
  const dispatch = useAppDispatch();

  const toggle = useCallback(
    () => dispatch({ type: "TOGGLE_PRICING" }),
    [dispatch]
  );

  return {
    showPricing,
    toggle,
    alwaysVisible: viewMode === "internal",
  };
}
