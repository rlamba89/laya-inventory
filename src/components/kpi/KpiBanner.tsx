"use client";

import { useAppState } from "@/providers/AppStateProvider";
import { computeKpis, formatCurrency } from "@/lib/utils";

export function KpiBanner() {
  const { viewMode, townhouses } = useAppState();

  if (viewMode !== "internal") return null;

  const kpis = computeKpis(townhouses);

  const items = [
    { label: "Est. GRV", value: formatCurrency(kpis.estGrv) },
    { label: "Sold Value", value: formatCurrency(kpis.soldValue) },
    { label: "Sold Rate", value: `${kpis.soldRate.toFixed(1)}%` },
    { label: "3-Bed", value: String(kpis.threeBed) },
    { label: "4-Bed", value: String(kpis.fourBed) },
  ];

  return (
    <div className="no-print fixed top-[60px] left-0 right-0 z-40 flex items-center justify-center gap-8 bg-navy px-6 py-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sand/70">
            {item.label}
          </span>
          <span className="font-sans text-sm font-bold text-gold-light">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
