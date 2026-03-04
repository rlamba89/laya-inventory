"use client";

import { useCompare } from "@/hooks/useCompare";
import { useProject } from "@/providers/ProjectProvider";

export function CompareChip({ thId }: { thId: number }) {
  const { toggle } = useCompare();
  const { project } = useProject();

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-charcoal-mid px-3 py-1 text-xs font-medium text-warm-white">
      {project.unit_label_short} {thId}
      <button
        onClick={() => toggle(thId)}
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-stone transition-colors hover:bg-white/20 hover:text-warm-white"
      >
        &times;
      </button>
    </span>
  );
}
