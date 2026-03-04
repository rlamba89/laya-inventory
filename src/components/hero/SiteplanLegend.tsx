"use client";

import { useState } from "react";
import { STATUS_CONFIG } from "@/lib/constants";

const LEGEND_ITEMS = [
  { status: "available", label: "Available" },
  { status: "sold", label: "Sold" },
  { status: "negotiation", label: "Negotiating" },
  { status: "hold", label: "On Hold" },
] as const;

export function SiteplanLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute left-2 top-2 z-20">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="rounded-full bg-charcoal/70 px-3 py-1 text-[10px] font-medium text-warm-white backdrop-blur-sm transition-colors hover:bg-charcoal"
      >
        {open ? "Hide" : "Legend"}
      </button>

      {open && (
        <div
          className="mt-2 rounded-lg bg-charcoal/80 p-3 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1.5">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-white/30"
                  style={{ backgroundColor: STATUS_CONFIG[item.status].color }}
                />
                <span className="text-[10px] text-white/90">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
