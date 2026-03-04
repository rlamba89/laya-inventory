"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppState } from "@/providers/AppStateProvider";
import { useProject } from "@/providers/ProjectProvider";
import { STATUS_CONFIG } from "@/lib/constants";

export function HoverTooltip() {
  const { hoveredId, townhouses, showPricing, activeModal } = useAppState();
  const { project } = useProject();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!hoveredId || activeModal) return null;
  const th = townhouses.find((t) => t.id === hoveredId);
  if (!th) return null;

  const config = STATUS_CONFIG[th.status];
  const hasRender = !!th.renderUrl;

  // Clamp to viewport — account for taller tooltip when render image is present
  const tooltipWidth = hasRender ? 320 : 224;
  const tooltipHeight = hasRender ? 380 : 160;
  const left = Math.min(pos.x + 16, window.innerWidth - tooltipWidth - 16);
  const top = Math.min(pos.y + 16, window.innerHeight - tooltipHeight);

  return (
    <div
      className={`pointer-events-none fixed z-[90] rounded-xl bg-charcoal text-warm-white shadow-xl overflow-hidden ${hasRender ? "w-80" : "w-56"}`}
      style={{
        left,
        top,
        transition: "opacity 0.12s ease",
      }}
    >
      {/* Render image at top */}
      {hasRender && (
        <div className="relative h-44 w-full bg-charcoal-mid">
          <Image
            src={th.renderUrl!}
            alt={`Type ${th.type} render`}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      )}

      <div className="p-3">
        <p className="font-serif text-base font-semibold">{project.unit_label_short} {th.id}</p>
        {th.type && (
          <p className="text-[10px] font-medium text-gold-light">Type {th.type}</p>
        )}
        <p className="mt-0.5 text-[10px] text-stone">{th.area} &middot; Stage {th.stg}</p>
        <p className="mt-1 text-[10px] text-sand">{th.desc}</p>
        <div className="mt-2 flex items-center gap-2 text-[10px]">
          <span>Total: {th.tot}m{"\u00B2"}</span>
          <span className="text-stone">&middot;</span>
          <span>Lot: {th.lot}m{"\u00B2"}</span>
        </div>
        {showPricing && (
          <p className="mt-1 text-xs font-bold text-gold-light">{th.price}</p>
        )}
        <div className="mt-2">
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase"
            style={{ color: config.color, backgroundColor: config.bg }}
          >
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
