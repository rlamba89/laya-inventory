"use client";

import { Townhouse } from "@/lib/types";
import { useProject } from "@/providers/ProjectProvider";
import { formatCurrency } from "@/lib/utils";

interface StatsSlideProps {
  townhouses: Townhouse[];
}

export function StatsSlide({ townhouses }: StatsSlideProps) {
  const { project } = useProject();

  const available = townhouses.filter((t) => t.status === "available").length;
  const sold = townhouses.filter((t) => t.status === "sold").length;
  const negotiation = townhouses.filter((t) => t.status === "negotiation").length;
  const hold = townhouses.filter((t) => t.status === "hold").length;

  const allPrices = townhouses.filter((t) => t.pMin > 0).map((t) => t.pMin);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  const grv = townhouses.reduce((s, t) => s + t.pMin, 0);
  const soldValue = townhouses.filter((t) => t.status === "sold").reduce((s, t) => s + t.pMin, 0);

  const stages = [...new Set(townhouses.map((t) => t.stg))].sort();
  const areas = [...new Set(townhouses.map((t) => t.area))];

  return (
    <div className="flex h-full items-center justify-center bg-charcoal p-8">
      <div className="w-full max-w-5xl">
        <h2 className="font-serif text-4xl font-semibold text-warm-white sm:text-5xl">
          Project Summary
        </h2>
        <p className="mt-2 text-sm text-stone">
          {project.name} — {townhouses.length} {project.unit_label.toLowerCase()}s across {stages.length} stages
        </p>

        <div className="my-8 h-px bg-white/10" />

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-4xl font-bold text-warm-white">{townhouses.length}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              Total {project.unit_label}s
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold text-available">{available}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              Available
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold text-sold">{sold}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              Sold
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold text-negotiation">{negotiation + hold}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone">
              In Progress
            </p>
          </div>
        </div>

        <div className="my-8 h-px bg-white/10" />

        {/* Financial */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">
              Price Range
            </p>
            <p className="mt-1 text-xl font-semibold text-gold">
              {minPrice > 0 ? `${formatCurrency(minPrice)} — ${formatCurrency(maxPrice)}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">
              Gross Revenue Value
            </p>
            <p className="mt-1 text-xl font-semibold text-warm-white">
              {formatCurrency(grv)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">
              Sold Value
            </p>
            <p className="mt-1 text-xl font-semibold text-warm-white">
              {formatCurrency(soldValue)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="mb-2 flex justify-between text-[10px] text-stone">
            <span>Sales Progress</span>
            <span>{Math.round((sold / townhouses.length) * 100)}% sold</span>
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="bg-sold transition-all duration-1000"
              style={{ width: `${(sold / townhouses.length) * 100}%` }}
            />
            <div
              className="bg-negotiation transition-all duration-1000"
              style={{ width: `${(negotiation / townhouses.length) * 100}%` }}
            />
            <div
              className="bg-hold transition-all duration-1000"
              style={{ width: `${(hold / townhouses.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Area breakdown */}
        <div className="mt-6 text-[10px] text-stone/60">
          Areas: {areas.join(" · ")}
        </div>
      </div>
    </div>
  );
}
