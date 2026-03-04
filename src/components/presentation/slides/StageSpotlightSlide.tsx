"use client";

import { Townhouse, ReleaseStatus } from "@/lib/types";
import { useProject } from "@/providers/ProjectProvider";
import { formatCurrency } from "@/lib/utils";

interface StageSpotlightSlideProps {
  stageNumber: number;
  townhouses: Townhouse[];
  releaseStatus: ReleaseStatus;
}

const STATUS_LABELS: Record<ReleaseStatus, string> = {
  unreleased: "Unreleased",
  coming_soon: "Coming Soon",
  now_selling: "Now Selling",
  sold_out: "Sold Out",
};

const STATUS_ACCENT: Record<ReleaseStatus, string> = {
  unreleased: "text-stone",
  coming_soon: "text-amber-400",
  now_selling: "text-emerald-400",
  sold_out: "text-stone",
};

export function StageSpotlightSlide({
  stageNumber,
  townhouses,
  releaseStatus,
}: StageSpotlightSlideProps) {
  const { project } = useProject();

  const available = townhouses.filter((t) => t.status === "available").length;
  const sold = townhouses.filter((t) => t.status === "sold").length;
  const negotiation = townhouses.filter((t) => t.status === "negotiation").length;

  const prices = townhouses.filter((t) => t.pMin > 0).map((t) => t.pMin);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const areas = [...new Set(townhouses.map((t) => t.area))];
  const bedTypes = [...new Set(townhouses.map((t) => t.beds))].sort();

  return (
    <div className="flex h-full items-center justify-center bg-charcoal p-8">
      <div className="w-full max-w-4xl">
        {/* Stage badge */}
        <div className="mb-3 flex items-center gap-3">
          <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${STATUS_ACCENT[releaseStatus]}`}>
            {STATUS_LABELS[releaseStatus]}
          </span>
        </div>

        {/* Stage name */}
        <h2 className="font-serif text-5xl font-semibold text-warm-white sm:text-6xl">
          Stage {stageNumber}
        </h2>
        <p className="mt-2 text-lg text-stone">
          {townhouses.length} {project.unit_label.toLowerCase()}s &middot; {areas.join(", ")}
        </p>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-white/10" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-3xl font-bold text-available">{available}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              Available
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-sold">{sold}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              Sold
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-negotiation">{negotiation}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              Negotiating
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-warm-white">{townhouses.length}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              Total
            </p>
          </div>
        </div>

        {/* Price range + bed types */}
        <div className="mt-8 flex flex-wrap gap-8">
          {minPrice > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">
                Price Range
              </p>
              <p className="mt-1 text-xl font-semibold text-gold">
                {formatCurrency(minPrice)} — {formatCurrency(maxPrice)}
              </p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">
              Configurations
            </p>
            <p className="mt-1 text-xl font-semibold text-warm-white">
              {bedTypes.map((b) => `${b} Bed`).join(" & ")}
            </p>
          </div>
        </div>

        {/* Visual bar: available vs sold */}
        <div className="mt-8">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10">
            {available > 0 && (
              <div
                className="bg-available transition-all duration-1000"
                style={{ width: `${(available / townhouses.length) * 100}%` }}
              />
            )}
            {negotiation > 0 && (
              <div
                className="bg-negotiation transition-all duration-1000"
                style={{ width: `${(negotiation / townhouses.length) * 100}%` }}
              />
            )}
            {sold > 0 && (
              <div
                className="bg-sold transition-all duration-1000"
                style={{ width: `${(sold / townhouses.length) * 100}%` }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
