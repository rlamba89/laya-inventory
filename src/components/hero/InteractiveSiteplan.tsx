"use client";

import Image from "next/image";
import { useState } from "react";
import { useAppState } from "@/providers/AppStateProvider";
import { SiteplanHotspot } from "./SiteplanHotspot";
import { hotspotPositions } from "@/lib/siteplan-hotspots";
import { useSiteplanZoom } from "@/hooks/useSiteplanZoom";

const SITEPLANS = [
  { id: "primary", label: "Primary", src: "/images/siteplans/siteplan-primary.png", hotspots: true },
  { id: "landscaping", label: "Landscaping", src: "/images/siteplans/siteplan-landscaping.png", hotspots: false },
  { id: "spaces", label: "Spaces", src: "/images/siteplans/siteplan-spaces.png", hotspots: false },
  { id: "staging", label: "Staging", src: "/images/siteplans/siteplan-staging.png", hotspots: false },
] as const;

export function InteractiveSiteplan() {
  const { townhouses } = useAppState();
  const [activeMap, setActiveMap] = useState<string>("primary");
  const { zoom, reset, handlers, style } = useSiteplanZoom();

  const activePlan = SITEPLANS.find((s) => s.id === activeMap)!;
  const statusMap = new Map(townhouses.map((th) => [th.id, th.status]));

  return (
    <div>
      {/* Siteplan selector tabs */}
      <div className="mb-3 flex items-center gap-4">
        <div className="flex gap-1.5">
          {SITEPLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => { setActiveMap(plan.id); reset(); }}
              className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all ${
                activeMap === plan.id
                  ? "bg-terracotta text-white"
                  : "bg-charcoal-mid/30 text-stone hover:text-warm-white"
              }`}
            >
              {plan.label}
            </button>
          ))}
        </div>
        {zoom.scale > 1 && (
          <button
            onClick={reset}
            className="rounded-full bg-charcoal-mid/30 px-3 py-1 text-[10px] font-medium text-stone transition-colors hover:text-warm-white"
          >
            Reset Zoom ({zoom.scale.toFixed(1)}x)
          </button>
        )}
      </div>

      {/* Siteplan image container */}
      <div
        className="relative overflow-hidden rounded-xl border border-charcoal-mid/30"
        {...handlers}
      >
        <div
          className="relative origin-center transition-transform duration-100"
          style={style}
        >
          <Image
            src={activePlan.src}
            alt={`LAYA Residences - ${activePlan.label}`}
            width={1729}
            height={1207}
            className="h-auto w-full"
            priority={activePlan.id === "primary"}
            draggable={false}
          />

          {/* Hotspot overlays - only on primary siteplan */}
          {activePlan.hotspots &&
            hotspotPositions.map((pos) => (
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
