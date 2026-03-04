"use client";

import { useProject } from "@/providers/ProjectProvider";
import { useAppState } from "@/providers/AppStateProvider";
import { LiveStats } from "./LiveStats";
import { InteractiveSiteplan } from "./InteractiveSiteplan";

export function HeroSection() {
  const { project } = useProject();
  const { townhouses } = useAppState();

  return (
    <section className="hero-section no-print relative overflow-hidden">
      {/* Brand header + stats */}
      <div className="bg-sand-light px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
              {project.name}
            </h1>
            {project.tagline && (
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-stone sm:text-[11px] sm:tracking-[0.25em]">
                {project.tagline}
                {project.location && <> &middot; {project.location}</>}
              </p>
            )}
            <p className="mt-0.5 text-[9px] tracking-wider text-stone/60 sm:text-[10px]">
              {townhouses.length} {project.unit_label}s
            </p>
          </div>

          <LiveStats />
        </div>
      </div>

      {/* Interactive Siteplan */}
      {project.siteplan_image_url && (
        <div className="bg-charcoal px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <InteractiveSiteplan />
          </div>
        </div>
      )}
    </section>
  );
}
