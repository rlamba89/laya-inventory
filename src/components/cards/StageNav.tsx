"use client";

import { useState, useEffect } from "react";
import { useProject } from "@/providers/ProjectProvider";
import { useAppState } from "@/providers/AppStateProvider";

export function StageNav() {
  const { stages, getStageInfo } = useProject();
  const { viewMode } = useAppState();
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stageNumbers = stages
    .map((s) => parseInt(s.name.replace(/\D/g, "")))
    .filter((n) => !isNaN(n));

  // Include unreleased stages in client view (shown as disabled)
  const visibleStages = stageNumbers.filter((num) => {
    if (viewMode !== "client") return true;
    const info = getStageInfo(num);
    if (info.release_status === "unreleased") return true;
    return info.visible_to_clients;
  });

  // Track which stage section is in view
  useEffect(() => {
    const sections = visibleStages
      .map((num) => document.getElementById(`stage-${num}`))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const num = Number(entry.target.id.replace("stage-", ""));
            if (!isNaN(num)) setActiveStage(num);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visibleStages]);

  const scrollTo = (stageNum: number) => {
    const el = document.getElementById(`stage-${stageNum}`);
    if (el) {
      const offset = 130; // navbar + filter bar height
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (visibleStages.length <= 1) return null;

  return (
    <div className="no-print sticky z-20 border-b border-sand/50 bg-white/90 px-8 py-2 backdrop-blur-sm" style={{ top: "var(--stage-nav-top, 116px)" }}>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-stone">
          Jump to
        </span>
        {visibleStages.map((num) => {
          const info = getStageInfo(num);
          const isUnreleased = viewMode === "client" && info.release_status === "unreleased";
          return (
            <button
              key={num}
              onClick={() => !isUnreleased && scrollTo(num)}
              disabled={isUnreleased}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                isUnreleased
                  ? "cursor-not-allowed bg-stone/10 text-stone/40"
                  : activeStage === num
                    ? "bg-charcoal text-warm-white"
                    : "bg-sand-light text-charcoal-mid hover:bg-sand hover:text-charcoal"
              }`}
            >
              Stage {num}
              {info.release_status === "coming_soon" && (
                <span className="ml-1 text-[8px] text-amber-500">Soon</span>
              )}
              {info.release_status === "sold_out" && (
                <span className="ml-1 text-[8px] text-stone">Sold</span>
              )}
              {isUnreleased && (
                <span className="ml-1 text-[8px] text-stone/40">TBA</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
