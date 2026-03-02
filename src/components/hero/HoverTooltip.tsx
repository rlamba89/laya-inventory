"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/providers/AppStateProvider";
import { STATUS_CONFIG } from "@/lib/constants";

export function HoverTooltip() {
  const { hoveredId, townhouses, showPricing } = useAppState();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!hoveredId) return null;
  const th = townhouses.find((t) => t.id === hoveredId);
  if (!th) return null;

  const config = STATUS_CONFIG[th.status];

  // Clamp to viewport
  const left = Math.min(pos.x + 16, window.innerWidth - 220);
  const top = Math.min(pos.y + 16, window.innerHeight - 160);

  return (
    <div
      className="pointer-events-none fixed z-[90] w-52 rounded-xl bg-charcoal p-3 text-warm-white shadow-xl"
      style={{
        left,
        top,
        transition: "opacity 0.12s ease",
      }}
    >
      <p className="font-serif text-base font-semibold">TH {th.id}</p>
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
  );
}
