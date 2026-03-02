"use client";

import { useAppState } from "@/providers/AppStateProvider";
import { computeKpis, countByStatus, formatCurrency } from "@/lib/utils";

export function InternalDashboardHeader() {
  const { townhouses } = useAppState();
  const kpis = computeKpis(townhouses);
  const counts = countByStatus(townhouses);

  return (
    <section className="no-print">
      {/* Brand Header */}
      <div className="bg-sand-light px-4 pt-8 pb-4 text-center sm:px-8 sm:pt-10 sm:pb-6">
        <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          LAYA{" "}
          <em className="font-normal italic text-charcoal-light">
            Residences
          </em>
        </h1>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-stone sm:text-[11px] sm:tracking-[0.3em]">
          Mediterranean-Inspired Luxury Townhouses &mdash; Taigum, Brisbane
        </p>
      </div>

      {/* Status Cards Row */}
      <div className="bg-sand-light px-4 pb-6 sm:px-8 sm:pb-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-4">
          <StatusCard
            dot="var(--available-green)"
            count={counts.available}
            label="Available"
          />
          <StatusCard
            dot="var(--sold-red)"
            count={counts.sold}
            label="Sold"
          />
          <StatusCard
            dot="var(--negotiation-amber)"
            count={counts.negotiation}
            label="Negotiation"
          />
          <StatusCard
            dot="var(--hold-blue)"
            count={counts.hold}
            label="On Hold"
          />
          <TotalCard count={kpis.total} />
        </div>
      </div>

      {/* Financial Metrics Banner */}
      <div className="bg-navy px-4 py-3 sm:px-8 sm:py-4">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:items-center sm:justify-center sm:gap-8">
          <MetricItem label="Total GDV" value={formatCurrency(kpis.estGrv)} />
          <MetricItem
            label="Sold Value"
            value={formatCurrency(kpis.soldValue)}
          />
          <MetricItem
            label="Available Value"
            value={formatCurrency(kpis.availableValue)}
          />
          <MetricItem
            label="In Negotiation"
            value={formatCurrency(kpis.negotiationValue)}
          />
          <MetricItem
            label="Sold Rate"
            value={`${kpis.soldRate.toFixed(0)}%`}
          />
          <MetricItem
            label="3 Bed / 4 Bed"
            value={`${kpis.threeBed} / ${kpis.fourBed}`}
          />
        </div>
      </div>
    </section>
  );
}

function StatusCard({
  dot,
  count,
  label,
}: {
  dot: string;
  count: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-warm-white px-3 py-3 shadow-sm sm:gap-1 sm:rounded-xl sm:px-6 sm:py-4">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
          style={{ backgroundColor: dot }}
        />
        <span className="font-sans text-2xl font-bold text-charcoal sm:text-3xl">
          {count}
        </span>
      </div>
      <span className="text-center text-[8px] font-semibold uppercase leading-tight tracking-wider text-stone sm:text-[9px]">
        {label}
      </span>
    </div>
  );
}

function TotalCard({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-charcoal px-3 py-3 shadow-sm sm:gap-1 sm:rounded-xl sm:px-6 sm:py-4">
      <span className="font-sans text-2xl font-bold text-warm-white sm:text-3xl">
        {count}
      </span>
      <span className="text-[8px] font-semibold uppercase tracking-wider text-sand/70 sm:text-[9px]">
        Total Lots
      </span>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-sand/70">
        {label}
      </span>
      <span className="font-sans text-sm font-bold text-gold-light">
        {value}
      </span>
    </div>
  );
}
