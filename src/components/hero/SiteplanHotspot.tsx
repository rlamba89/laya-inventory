"use client";

import { TownhouseStatus } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { useAppDispatch } from "@/providers/AppStateProvider";

interface SiteplanHotspotProps {
  id: number;
  x: number;
  y: number;
  status: TownhouseStatus;
}

export function SiteplanHotspot({ id, x, y, status }: SiteplanHotspotProps) {
  const dispatch = useAppDispatch();
  const config = STATUS_CONFIG[status];

  return (
    <button
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm transition-transform hover:scale-125"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: config.color,
      }}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SET_MODAL", payload: { type: "detail", thId: id } });
      }}
      onMouseEnter={() => dispatch({ type: "SET_HOVERED", payload: id })}
      onMouseLeave={() => dispatch({ type: "SET_HOVERED", payload: null })}
      title={`TH ${id}`}
    >
      {id}
    </button>
  );
}
