"use client";

import { Townhouse } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { useAppDispatch } from "@/providers/AppStateProvider";
import { useProject } from "@/providers/ProjectProvider";
import { useCompare } from "@/hooks/useCompare";
import { MouseEvent } from "react";

interface TownhouseCardProps {
  th: Townhouse;
  index: number;
}

export function TownhouseCard({ th, index }: TownhouseCardProps) {
  const dispatch = useAppDispatch();
  const { project } = useProject();
  const { isSelected, toggle } = useCompare();
  const selected = isSelected(th.id);
  const statusColor = STATUS_CONFIG[th.status].color;

  const handleClick = (e: MouseEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      toggle(th.id);
      return;
    }
    dispatch({ type: "SET_MODAL", payload: { type: "detail", thId: th.id } });
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.preventDefault();
    toggle(th.id);
  };

  return (
    <div
      className={`townhouse-card animate-fade-up group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-200 ${
        th.status === "sold"
          ? "opacity-55"
          : th.status === "hold"
            ? "opacity-80 hover:shadow-md"
            : th.status === "available"
              ? "hover:-translate-y-1 hover:shadow-lg"
              : th.status === "negotiation"
                ? "ring-1 ring-negotiation/20 hover:-translate-y-0.5 hover:shadow-lg"
                : "hover:shadow-lg"
      } ${selected ? "ring-2 ring-gold" : ""}`}
      style={{
        animationDelay: `${index * 40}ms`,
        boxShadow: "var(--shadow-sm)",
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => dispatch({ type: "SET_HOVERED", payload: th.id })}
      onMouseLeave={() => dispatch({ type: "SET_HOVERED", payload: null })}
    >
      {/* Sold ribbon */}
      {th.status === "sold" && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-16 w-16 overflow-hidden">
          <div className="absolute right-[-20px] top-[8px] w-[80px] rotate-45 bg-sold py-0.5 text-center text-[8px] font-bold uppercase tracking-wider text-white shadow-sm">
            Sold
          </div>
        </div>
      )}

      {/* Status color strip */}
      <div
        className="h-[3.5px] w-full"
        style={{ backgroundColor: statusColor }}
      />

      <div className="p-4">
        {/* Compare checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle(th.id);
          }}
          className={`absolute right-3 top-5 flex h-5 w-5 items-center justify-center rounded border text-[10px] transition-all ${
            selected
              ? "border-gold bg-gold text-white"
              : "border-sand bg-transparent text-transparent group-hover:border-stone group-hover:text-stone"
          }`}
        >
          {selected ? "\u2713" : "\u2713"}
        </button>

        {/* Unit number */}
        <h3 className="font-serif text-xl font-semibold text-charcoal">
          {project.unit_label_short} {th.id}
        </h3>
        <p className="mt-0.5 text-[10.5px] text-charcoal-light">
          {th.type && <span className="font-semibold">{th.type} &ndash; </span>}
          {th.beds} Bed, {th.baths} Bath, {th.cars} Car
        </p>

        {/* Pill tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-medium text-charcoal-mid">
            {th.beds} Bed
          </span>
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-medium text-charcoal-mid">
            {th.tot}m²
          </span>
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-medium text-charcoal-mid">
            {th.lot}m² lot
          </span>
        </div>

        {/* Status + Price */}
        <div className="mt-3 flex flex-col gap-1">
          <StatusBadge status={th.status} />
          <PriceDisplay price={th.price} />
        </div>
      </div>
    </div>
  );
}
