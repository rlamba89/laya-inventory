"use client";

import { Townhouse, ReleaseStatus } from "@/lib/types";
import { useProject } from "@/providers/ProjectProvider";
import { useAppState } from "@/providers/AppStateProvider";
import { AreaGroup } from "./AreaGroup";
import { StageBadge } from "./StageBadge";
import { CountdownTimer } from "@/components/shared/CountdownTimer";

interface StageGroupProps {
  stage: number;
  areas: Record<string, Townhouse[]>;
  startIndex: number;
  releaseStatus?: ReleaseStatus;
  releaseDate?: string | null;
}

export function StageGroup({ stage, areas, startIndex, releaseStatus, releaseDate }: StageGroupProps) {
  const { project, getGroupsByType } = useProject();
  const { viewMode } = useAppState();

  // Get area ordering from project groups (sorted by sort_order in DB)
  const areaGroups = getGroupsByType("area");
  const areaOrder = areaGroups.map((g) => g.name);
  // Include any areas present in data but not in group config
  const allAreas = [...new Set([...areaOrder, ...Object.keys(areas)])];
  const totalCount = Object.values(areas).reduce((sum, arr) => sum + arr.length, 0);

  const isUnreleased = releaseStatus === "unreleased";
  const isComingSoon = releaseStatus === "coming_soon";
  const isSoldOut = releaseStatus === "sold_out";
  // Only show placeholder for unreleased stages in client view
  const showUnreleasedPlaceholder = isUnreleased && viewMode === "client";

  // Return null only if empty AND not an unreleased placeholder
  if (totalCount === 0 && !showUnreleasedPlaceholder) return null;

  let runningIndex = startIndex;

  return (
    <section
      id={`stage-${stage}`}
      className={`mb-10 transition-opacity ${
        viewMode === "client"
          ? (showUnreleasedPlaceholder ? "opacity-50" : isComingSoon ? "opacity-60" : isSoldOut ? "opacity-70" : "")
          : ""
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="font-serif text-2xl font-semibold text-charcoal">
          Stage {stage}
        </h3>
        {(!isUnreleased || viewMode !== "client") && totalCount > 0 && (
          <span className="rounded-full bg-sand-light px-3 py-0.5 text-[11px] font-semibold text-charcoal-mid">
            {totalCount} {project.unit_label.toLowerCase()}s
          </span>
        )}
        {releaseStatus && (
          <StageBadge status={releaseStatus} />
        )}
        {isComingSoon && releaseDate && (
          <CountdownTimer releaseDate={releaseDate} />
        )}
      </div>

      {showUnreleasedPlaceholder ? (
        <div className="rounded-xl border border-dashed border-stone/30 bg-sand-light/50 px-6 py-12 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-stone/10">
            <svg
              className="h-5 w-5 text-stone"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <p className="font-serif text-lg font-semibold text-charcoal-light">
            Coming Soon
          </p>
          <p className="mt-1 text-sm text-stone">
            This stage has not been released yet. Details will be available soon.
          </p>
        </div>
      ) : (
        allAreas.map((area) => {
          const areaData = areas[area] || [];
          if (areaData.length === 0) return null;
          const idx = runningIndex;
          runningIndex += areaData.length;
          return (
            <AreaGroup
              key={area}
              area={area}
              townhouses={areaData}
              startIndex={idx}
            />
          );
        })
      )}
    </section>
  );
}
