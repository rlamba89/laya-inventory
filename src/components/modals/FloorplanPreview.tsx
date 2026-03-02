"use client";

import Image from "next/image";
import { getFloorplanImage } from "@/lib/floorplan-map";
import { useAppDispatch } from "@/providers/AppStateProvider";

export function FloorplanPreview({ type }: { type: string }) {
  const dispatch = useAppDispatch();
  const imageSrc = getFloorplanImage(type);

  if (!imageSrc) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-sand bg-ivory/30">
        <div className="text-center">
          <p className="text-sm font-medium text-stone">
            {type === "Cust" ? "Custom Layout" : "Floor plan to be confirmed"}
          </p>
          <p className="mt-0.5 text-[10px] text-stone/60">
            Contact sales team for details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cursor-zoom-in overflow-hidden rounded-xl border border-sand"
      onClick={() =>
        dispatch({ type: "SET_MODAL", payload: { type: "lightbox", src: imageSrc } })
      }
    >
      <div className="bg-ivory/30 p-2">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-stone">
          Type {type} — Floor Plan
        </p>
        <Image
          src={imageSrc}
          alt={`Type ${type} floor plan`}
          width={1729}
          height={1207}
          className="h-auto w-full rounded-lg"
        />
      </div>
    </div>
  );
}
