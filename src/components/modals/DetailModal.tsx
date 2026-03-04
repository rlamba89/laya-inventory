"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";
import { useProject } from "@/providers/ProjectProvider";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { StatusEditor } from "@/components/shared/StatusEditor";
import { AreaBreakdownChart } from "./AreaBreakdownChart";
import { FloorplanViewer } from "./FloorplanViewer";
import { UnitGallery } from "./UnitGallery";
import { useCompare } from "@/hooks/useCompare";
import { Media } from "@/lib/types";

export function DetailModal({ thId }: { thId: number }) {
  const { townhouses } = useAppState();
  const dispatch = useAppDispatch();
  const { project } = useProject();
  const { isSelected, toggle, canAdd } = useCompare();
  const th = townhouses.find((t) => t.id === thId);

  const [unitMedia, setUnitMedia] = useState<Media[]>([]);

  // Fetch media for this unit's type only (renders, floorplans)
  // If unit has no type assigned, don't show any type media
  useEffect(() => {
    if (!th || !th.unitTypeId) {
      setUnitMedia([]);
      return;
    }
    let cancelled = false;

    async function fetchMedia() {
      try {
        const res = await fetch(`/api/projects/${project.slug}/media?unit_type_id=${th!.unitTypeId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setUnitMedia(data.media ?? []);
        }
      } catch {
        // Silently fail — media is optional enhancement
      }
    }

    fetchMedia();
    return () => { cancelled = true; };
  }, [th, project.slug]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "SET_MODAL", payload: null });
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  if (!th) return null;

  const selected = isSelected(th.id);

  // Gallery media: renders, photos, gallery items (not floorplans, not siteplan)
  const galleryMedia = useMemo(
    () => unitMedia.filter((m) => ["render", "photo", "gallery"].includes(m.media_type)),
    [unitMedia]
  );

  // Floorplan media
  const floorplanMedia = useMemo(
    () => unitMedia.filter((m) => m.media_type === "floorplan"),
    [unitMedia]
  );

  const stats = [
    { label: "Bedrooms", value: th.beds },
    { label: "Bathrooms", value: th.baths },
    { label: "Car Spaces", value: th.cars },
    { label: "Total Area", value: `${th.tot}m\u00B2` },
    { label: "Lot Size", value: `${th.lot}m\u00B2` },
    { label: "Patio", value: `${th.pat}m\u00B2` },
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-warm-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-sand-light text-charcoal-light transition-colors hover:bg-sand hover:text-charcoal"
          onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
        >
          &times;
        </button>

        {/* Gallery at top */}
        {galleryMedia.length > 0 && (
          <div className="p-4 pb-0">
            <UnitGallery media={galleryMedia} />
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <h2 className="font-serif text-3xl font-semibold text-charcoal">
            {project.unit_label} {th.id}
          </h2>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">
            {th.area} &middot; Stage {th.stg}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={th.status} />
            {th.type && (
              <span className="text-[10px] font-medium text-stone">
                Type {th.type}
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-ivory p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">
                  {stat.label}
                </p>
                <p className="mt-0.5 font-sans text-lg font-bold text-charcoal">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="mt-5">
            <PriceDisplay price={th.price} />
          </div>

          {/* Status Editor (internal only) */}
          <div className="mt-4">
            <StatusEditor thId={th.id} currentStatus={th.status} />
          </div>

          {/* Area breakdown */}
          <div className="mt-6">
            <AreaBreakdownChart th={th} />
          </div>

          {/* Floor plan with variant tabs */}
          <div className="mt-6">
            <FloorplanViewer
              unitType={th.type}
              media={floorplanMedia.length > 0 ? floorplanMedia : undefined}
            />
          </div>

          {/* Compare button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => toggle(th.id)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                selected
                  ? "bg-gold text-white"
                  : canAdd
                    ? "bg-charcoal text-warm-white hover:bg-charcoal-mid"
                    : "cursor-not-allowed bg-sand text-stone"
              }`}
              disabled={!selected && !canAdd}
            >
              {selected ? "Remove from Compare" : "+ Add to Compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
