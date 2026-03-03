"use client";

import Image from "next/image";
import { useAppState } from "@/providers/AppStateProvider";
import { SiteplanHotspot } from "./SiteplanHotspot";
import { hotspotPositions } from "@/lib/siteplan-hotspots";
import { useSiteplanZoom } from "@/hooks/useSiteplanZoom";

export function InteractiveSiteplan() {
  const { townhouses } = useAppState();
  const { zoom, reset, handlers, style } = useSiteplanZoom();

  const statusMap = new Map(townhouses.map((th) => [th.id, th.status]));

  return (
    <div>
      {/* Siteplan image container */}
      <div
        className="relative overflow-hidden rounded-xl border border-charcoal-mid/30"
        {...handlers}
      >
        {/* Floating zoom reset */}
        {zoom.scale > 1 && (
          <button
            onClick={reset}
            className="absolute right-2 top-2 z-20 rounded-full bg-charcoal/70 px-3 py-1 text-[10px] font-medium text-warm-white backdrop-blur-sm transition-colors hover:bg-charcoal"
          >
            Reset Zoom ({zoom.scale.toFixed(1)}x)
          </button>
        )}

        <div
          className="relative origin-center transition-transform duration-100"
          style={style}
        >
          <Image
            src="/images/siteplans/site-plan.png"
            alt="LAYA Residences Site Plan"
            width={1984}
            height={1083}
            className="h-auto w-full"
            priority
            draggable={false}
          />

          {/* Hotspot overlays */}
          {hotspotPositions.map((pos) => (
            <SiteplanHotspot
              key={pos.id}
              id={pos.id}
              x={pos.x}
              y={pos.y}
              status={statusMap.get(pos.id) || "available"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
