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
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
                 w-[5px] h-[5px] sm:w-auto sm:h-[18px] sm:min-w-[22px]
                 rounded-full sm:px-1.5 text-[0px] sm:text-[9px] font-bold text-white
                 ring-1 ring-white/30 shadow-sm
                 opacity-70 transition-all duration-150 ease-out
                 hover:opacity-95 hover:scale-[1.35] hover:shadow-md hover:ring-white/60"
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
