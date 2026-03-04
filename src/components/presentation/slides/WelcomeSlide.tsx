"use client";

import { useProject } from "@/providers/ProjectProvider";

export function WelcomeSlide() {
  const { project } = useProject();

  return (
    <div className="flex h-full items-center justify-center bg-charcoal p-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          {project.branding.developer_name || "Property Development"}
        </p>
        <h1 className="mt-4 font-serif text-6xl font-semibold text-warm-white sm:text-7xl lg:text-8xl">
          {project.name}
        </h1>
        {project.tagline && (
          <p className="mt-4 text-lg tracking-wide text-stone sm:text-xl">
            {project.tagline}
          </p>
        )}
        {project.location && (
          <p className="mt-2 text-sm text-stone/60">
            {project.location}
          </p>
        )}
        <div className="mt-10 flex justify-center">
          <div className="h-px w-24 bg-gold/40" />
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-stone/40">
          Press &rarr; to begin
        </p>
      </div>
    </div>
  );
}
