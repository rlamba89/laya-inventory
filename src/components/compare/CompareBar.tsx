"use client";

import { useCompare } from "@/hooks/useCompare";
import { useAppDispatch } from "@/providers/AppStateProvider";
import { CompareChip } from "./CompareChip";

export function CompareBar() {
  const { compareIds, clear, canCompare } = useCompare();
  const dispatch = useAppDispatch();

  if (compareIds.length === 0) return null;

  return (
    <div className="compare-bar no-print fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between rounded-t-2xl bg-charcoal px-8 py-4 shadow-xl transition-transform duration-300">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone">
          Compare
        </span>
        <div className="flex gap-2">
          {compareIds.map((id) => (
            <CompareChip key={id} thId={id} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={clear}
          className="text-xs text-stone transition-colors hover:text-warm-white"
        >
          Clear
        </button>
        <button
          onClick={() => {
            if (canCompare) {
              dispatch({ type: "SET_MODAL", payload: { type: "compare" } });
            }
          }}
          disabled={!canCompare}
          className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
            canCompare
              ? "bg-terracotta text-white hover:bg-terracotta-deep"
              : "cursor-not-allowed bg-charcoal-mid text-stone"
          }`}
        >
          Compare Now
        </button>
      </div>
    </div>
  );
}
