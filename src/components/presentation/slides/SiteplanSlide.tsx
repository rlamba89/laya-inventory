"use client";

import Image from "next/image";
import { Townhouse } from "@/lib/types";
import { useProject } from "@/providers/ProjectProvider";
import { STATUS_CONFIG } from "@/lib/constants";

interface SiteplanSlideProps {
  townhouses: Townhouse[];
}

export function SiteplanSlide({ townhouses }: SiteplanSlideProps) {
  const { project } = useProject();
  const hotspots = townhouses
    .filter((th) => th.hotspot_x != null && th.hotspot_y != null)
    .map((th) => ({ id: th.id, x: th.hotspot_x!, y: th.hotspot_y!, status: th.status }));

  const available = townhouses.filter((t) => t.status === "available").length;
  const sold = townhouses.filter((t) => t.status === "sold").length;

  return (
    <div className="flex h-full flex-col bg-charcoal p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-warm-white">
            Master Site Plan
          </h2>
          <p className="mt-1 text-sm text-stone">
            {townhouses.length} {project.unit_label.toLowerCase()}s across {new Set(townhouses.map((t) => t.stg)).size} stages
          </p>
        </div>
        {/* Quick stats */}
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-available">{available}</p>
            <p className="text-[10px] uppercase tracking-wider text-stone">Available</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-sold">{sold}</p>
            <p className="text-[10px] uppercase tracking-wider text-stone">Sold</p>
          </div>
        </div>
      </div>

      {/* Siteplan */}
      <div className="relative flex-1 overflow-hidden rounded-xl border border-charcoal-mid/30">
        <Image
          src={project.siteplan_image_url ?? "/images/siteplans/site-plan.png"}
          alt={`${project.name} Site Plan`}
          width={project.siteplan_width ?? 1984}
          height={project.siteplan_height ?? 1083}
          className="h-full w-full object-contain"
          priority
        />
        {/* Hotspots from DB data */}
        {hotspots.map((pos) => (
          <span
            key={pos.id}
            className="absolute h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white/30 sm:h-[10px] sm:w-[10px]"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              backgroundColor: STATUS_CONFIG[pos.status].color,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex justify-center gap-6">
        {(["available", "sold", "negotiation", "hold"] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_CONFIG[s].color }}
            />
            <span className="text-[10px] text-white/70">{STATUS_CONFIG[s].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
