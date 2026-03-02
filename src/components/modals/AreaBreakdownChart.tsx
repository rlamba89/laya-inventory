"use client";

import { Townhouse } from "@/lib/types";

const BARS = [
  { key: "gI" as const, label: "Ground Living", color: "var(--terracotta)" },
  { key: "uI" as const, label: "Upper Living", color: "var(--olive)" },
  { key: "gG" as const, label: "Garage", color: "var(--navy)" },
  {
    key: "outdoor" as const,
    label: "Outdoor",
    color: "var(--gold)",
  },
] as const;

export function AreaBreakdownChart({ th }: { th: Townhouse }) {
  const values: Record<string, number> = {
    gI: th.gI,
    uI: th.uI,
    gG: th.gG,
    outdoor: th.uB + th.pat + th.eF + th.eB,
  };

  const maxVal = Math.max(...Object.values(values));

  return (
    <div className="rounded-xl border border-sand bg-ivory/50 p-5">
      <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone">
        Area Breakdown
      </h4>
      <div className="flex flex-col gap-3">
        {BARS.map((bar, i) => {
          const val = values[bar.key];
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
          return (
            <div key={bar.key} className="flex items-center gap-3">
              <span className="w-24 text-right text-[11px] font-medium text-charcoal-light">
                {bar.label}
              </span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-sand-light">
                <div
                  className="animate-grow-width flex h-full items-center rounded-md px-3"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: bar.color,
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <span className="text-[11px] font-bold text-white">
                    {val}m\u00B2
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
