"use client";

import { useProject } from "@/providers/ProjectProvider";

export function CtaSlide() {
  const { project } = useProject();

  return (
    <div className="flex h-full items-center justify-center bg-charcoal p-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Thank You
        </p>
        <h2 className="mt-4 font-serif text-5xl font-semibold text-warm-white sm:text-6xl">
          {project.name}
        </h2>
        {project.tagline && (
          <p className="mt-3 text-lg text-stone">{project.tagline}</p>
        )}

        <div className="mt-10 h-px w-24 mx-auto bg-gold/40" />

        <div className="mt-10 space-y-2">
          {project.branding.developer_name && (
            <p className="text-sm font-medium text-warm-white">
              {project.branding.developer_name}
            </p>
          )}
          {project.location && (
            <p className="text-sm text-stone">{project.location}</p>
          )}
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.2em] text-stone/40">
          Contact our sales team to secure your home
        </p>
      </div>
    </div>
  );
}
