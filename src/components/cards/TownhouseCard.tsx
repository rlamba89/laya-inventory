"use client";

import { Townhouse } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { useAppDispatch } from "@/providers/AppStateProvider";
import { useCompare } from "@/hooks/useCompare";
import { MouseEvent } from "react";

interface TownhouseCardProps {
  th: Townhouse;
  index: number;
}

export function TownhouseCard({ th, index }: TownhouseCardProps) {
  const dispatch = useAppDispatch();
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
      className={`townhouse-card animate-fade-up group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-200 hover:shadow-lg ${
        th.status === "sold" ? "opacity-55" : ""
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

        {/* TH number */}
        <h3 className="font-serif text-xl font-semibold text-charcoal">
          TH {th.id}
        </h3>
        <p className="mt-0.5 text-[10.5px] text-charcoal-light">
          {th.desc}
        </p>

        {/* Pill tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-medium text-charcoal-mid">
            {th.beds} Bed
          </span>
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-medium text-charcoal-mid">
            {th.tot}m\u00B2
          </span>
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-medium text-charcoal-mid">
            {th.lot}m\u00B2 lot
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
