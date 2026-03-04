"use client";

import { useProject } from "@/providers/ProjectProvider";
import { useAppState } from "@/providers/AppStateProvider";
import { ReleaseStatus } from "@/lib/types";

const STATUS_STYLES: Record<ReleaseStatus, { bg: string; text: string; dot: string }> = {
  unreleased: { bg: "bg-stone/10", text: "text-stone/40", dot: "bg-stone/30" },
  coming_soon: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  now_selling: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  sold_out: { bg: "bg-stone/10", text: "text-stone", dot: "bg-stone" },
};

export function StageTimeline() {
  const { stages, getStageInfo } = useProject();
  const { viewMode } = useAppState();

  if (stages.length === 0) return null;

  // In client view, include unreleased stages (greyed out) but hide explicitly hidden stages
  const visibleStages = stages.filter((stage) => {
    if (viewMode !== "client") return true;
    const num = parseInt(stage.name.replace(/\D/g, ""));
    const info = getStageInfo(num);
    if (info.release_status === "unreleased") return true;
    return info.visible_to_clients;
  });

  if (visibleStages.length === 0) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto px-8 py-4">
      {visibleStages.map((stage, i) => {
        const num = parseInt(stage.name.replace(/\D/g, ""));
        const info = getStageInfo(num);
        const style = STATUS_STYLES[info.release_status];

        return (
          <div key={stage.id} className="flex items-center">
            {/* Stage pill */}
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${style.bg}`}>
              <span className={`h-2 w-2 rounded-full ${style.dot}`} />
              <span className={`text-[10px] font-semibold whitespace-nowrap ${style.text}`}>
                {stage.name}
              </span>
            </div>
            {/* Connector */}
            {i < visibleStages.length - 1 && (
              <div className="mx-1 h-px w-6 bg-sand" />
            )}
          </div>
        );
      })}
    </div>
  );
}
