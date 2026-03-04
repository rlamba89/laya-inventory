"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useAppState } from "@/providers/AppStateProvider";
import { useProject } from "@/providers/ProjectProvider";
import { SiteplanHotspot } from "./SiteplanHotspot";
import { SiteplanLegend } from "./SiteplanLegend";
import { useSiteplanZoom } from "@/hooks/useSiteplanZoom";

export function InteractiveSiteplan() {
  const { townhouses } = useAppState();
  const { project } = useProject();
  const { zoom, reset, handlers, style } = useSiteplanZoom();
  const containerRef = useRef<HTMLDivElement>(null);

  // Build hotspot positions from townhouse data (from DB)
  const hotspots = townhouses
    .filter((th) => th.hotspot_x != null && th.hotspot_y != null)
    .map((th) => ({ id: th.id, x: th.hotspot_x!, y: th.hotspot_y!, status: th.status }));

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  return (
    <div>
      {/* Siteplan image container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-charcoal-mid/30 bg-charcoal"
        {...handlers}
      >
        {/* Legend */}
        <SiteplanLegend />

        {/* Floating controls (top-right) */}
        <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5">
          {zoom.scale > 1 && (
            <button
              onClick={reset}
              className="rounded-full bg-charcoal/70 px-3 py-1 text-[10px] font-medium text-warm-white backdrop-blur-sm transition-colors hover:bg-charcoal"
            >
              Reset ({zoom.scale.toFixed(1)}x)
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="rounded-full bg-charcoal/70 px-2.5 py-1 text-[10px] font-medium text-warm-white backdrop-blur-sm transition-colors hover:bg-charcoal"
            title="Toggle fullscreen"
          >
            &#x26F6;
          </button>
        </div>

        <div
          className="relative origin-center transition-transform duration-100"
          style={style}
        >
          <Image
            src={project.siteplan_image_url ?? "/images/siteplans/site-plan.png"}
            alt={`${project.name} Site Plan`}
            width={project.siteplan_width ?? 1984}
            height={project.siteplan_height ?? 1083}
            className="h-auto w-full"
            priority
            draggable={false}
          />

          {/* Hotspot overlays */}
          {hotspots.map((pos) => (
            <SiteplanHotspot
              key={pos.id}
              id={pos.id}
              x={pos.x}
              y={pos.y}
              status={pos.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
