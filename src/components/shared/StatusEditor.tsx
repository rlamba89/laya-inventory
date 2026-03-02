"use client";

import { TownhouseStatus } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";

const statuses: TownhouseStatus[] = ["available", "sold", "negotiation", "hold"];

export function StatusEditor({ thId, currentStatus }: { thId: number; currentStatus: TownhouseStatus }) {
  const { viewMode } = useAppState();
  const dispatch = useAppDispatch();

  if (viewMode !== "internal") return null;

  const handleChange = async (newStatus: TownhouseStatus) => {
    dispatch({ type: "UPDATE_STATUS", payload: { id: thId, status: newStatus } });

    try {
      const res = await fetch("/api/townhouses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: thId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch {
      dispatch({ type: "UPDATE_STATUS", payload: { id: thId, status: currentStatus } });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-stone">
        Update Status
      </label>
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value as TownhouseStatus)}
        className="rounded-lg border border-sand bg-warm-white px-3 py-1.5 text-xs font-medium text-charcoal focus:border-terracotta focus:outline-none"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {STATUS_CONFIG[s].label}
          </option>
        ))}
      </select>
    </div>
  );
}
