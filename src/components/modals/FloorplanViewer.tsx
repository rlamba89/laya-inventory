"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Media } from "@/lib/types";
import { useAppDispatch } from "@/providers/AppStateProvider";

const VARIANT_LABELS: Record<string, string> = {
  ground: "Ground Floor",
  upper: "Upper Floor",
  facade: "Facade",
  main: "Floor Plan",
};

interface FloorplanViewerProps {
  unitType: string;
  media?: Media[];
}

export function FloorplanViewer({ unitType, media }: FloorplanViewerProps) {
  const dispatch = useAppDispatch();

  // Group floorplan media by variant
  const floorplanMedia = useMemo(() => {
    if (!media || media.length === 0) return [];
    return media.filter((m) => m.media_type === "floorplan");
  }, [media]);

  const variants = useMemo(() => {
    if (floorplanMedia.length === 0) return [];
    const variantSet = new Set(floorplanMedia.map((m) => m.variant || "main"));
    return Array.from(variantSet);
  }, [floorplanMedia]);

  const [activeVariant, setActiveVariant] = useState<string>(
    variants[0] || "main"
  );

  if (floorplanMedia.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-sand bg-ivory/30">
        <div className="text-center">
          <p className="text-sm font-medium text-stone">
            {unitType === "Cust" ? "Custom Layout" : "Floor plan to be confirmed"}
          </p>
          <p className="mt-0.5 text-[10px] text-stone/60">
            Contact sales team for details
          </p>
        </div>
      </div>
    );
  }

  // Media with variant tabs
  const activeMedia = floorplanMedia.filter(
    (m) => (m.variant || "main") === activeVariant
  );
  const allFloorplanUrls = floorplanMedia.map((m) => m.url);

  return (
    <div>
      {/* Variant tabs */}
      {variants.length > 1 && (
        <div className="mb-3 flex gap-1">
          {variants.map((v) => (
            <button
              key={v}
              onClick={() => setActiveVariant(v)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                activeVariant === v
                  ? "bg-charcoal text-warm-white"
                  : "bg-sand-light text-stone hover:bg-sand hover:text-charcoal"
              }`}
            >
              {VARIANT_LABELS[v] || v}
            </button>
          ))}
        </div>
      )}

      {/* Floor plan image(s) */}
      {activeMedia.map((item, i) => (
        <div
          key={item.id}
          className="cursor-zoom-in overflow-hidden rounded-xl border border-sand"
          onClick={() =>
            dispatch({
              type: "SET_MODAL",
              payload: {
                type: "lightbox",
                src: item.url,
                gallery: allFloorplanUrls,
                galleryIndex: allFloorplanUrls.indexOf(item.url),
              },
            })
          }
        >
          <div className="bg-ivory/30 p-2">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-stone">
              Type {unitType} — {VARIANT_LABELS[item.variant || "main"] || "Floor Plan"}
            </p>
            <Image
              src={item.url}
              alt={item.alt_text || `Type ${unitType} floor plan`}
              width={1729}
              height={1207}
              className="h-auto w-full rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
