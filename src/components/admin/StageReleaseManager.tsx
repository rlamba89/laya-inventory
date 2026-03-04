"use client";

import { useState } from "react";
import { Group, ReleaseStatus } from "@/lib/types";
import { useProject } from "@/providers/ProjectProvider";

const RELEASE_STATUSES: { value: ReleaseStatus; label: string; description: string }[] = [
  { value: "unreleased", label: "Unreleased", description: "Shows placeholder on client page, no unit details visible" },
  { value: "coming_soon", label: "Coming Soon", description: "Visible but greyed out, with countdown" },
  { value: "now_selling", label: "Now Selling", description: "Active sales, fully visible" },
  { value: "sold_out", label: "Sold Out", description: "Visible but faded" },
];

const STATUS_COLORS: Record<ReleaseStatus, string> = {
  unreleased: "border-stone/20 bg-stone/5",
  coming_soon: "border-amber-300 bg-amber-50",
  now_selling: "border-emerald-300 bg-emerald-50",
  sold_out: "border-stone/30 bg-stone/10",
};

const STATUS_DOT: Record<ReleaseStatus, string> = {
  unreleased: "bg-stone/30",
  coming_soon: "bg-amber-400",
  now_selling: "bg-emerald-500",
  sold_out: "bg-stone",
};

interface StageReleaseManagerProps {
  projectSlug: string;
  initialStages: Group[];
}

export function StageReleaseManager({ projectSlug, initialStages }: StageReleaseManagerProps) {
  const { project } = useProject();
  const [stages, setStages] = useState(initialStages);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  const updateStage = async (
    groupId: string,
    updates: { release_status?: ReleaseStatus; visible_to_clients?: boolean; release_date?: string | null }
  ) => {
    setSaving(groupId);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectSlug}/stages/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      // Update local state
      setStages((prev) =>
        prev.map((s) =>
          s.id === groupId ? { ...s, ...updates } : s
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(null);
    }
  };

  const handleStatusChange = (groupId: string, status: ReleaseStatus) => {
    const visibleToClients = status !== "unreleased";
    updateStage(groupId, { release_status: status, visible_to_clients: visibleToClients });
  };

  const handleDateChange = (groupId: string, date: string) => {
    updateStage(groupId, { release_date: date || null });
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Stage Release Management
        </h1>
        <p className="mt-1 text-sm text-stone">
          Control when stages become visible to clients
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Release flow diagram */}
      <div className="mb-6 flex items-center gap-2 text-[10px] font-medium text-stone">
        <span className="rounded-full bg-stone/10 px-2 py-0.5">Unreleased</span>
        <span>&rarr;</span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">Coming Soon</span>
        <span>&rarr;</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">Now Selling</span>
        <span>&rarr;</span>
        <span className="rounded-full bg-stone/10 px-2 py-0.5">Sold Out</span>
      </div>

      {/* Stage Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage) => {
          const status = stage.release_status as ReleaseStatus;
          const isSaving = saving === stage.id;

          return (
            <div
              key={stage.id}
              className={`rounded-xl border-2 p-5 transition-colors ${STATUS_COLORS[status]} ${
                isSaving ? "opacity-60" : ""
              }`}
            >
              {/* Stage header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  {stage.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone">
                    {RELEASE_STATUSES.find((s) => s.value === status)?.label}
                  </span>
                </div>
              </div>

              {/* Status selector */}
              <div className="space-y-1.5 mb-4">
                {RELEASE_STATUSES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(stage.id, opt.value)}
                    disabled={isSaving}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      status === opt.value
                        ? "bg-white shadow-sm font-medium text-charcoal"
                        : "text-stone hover:bg-white/50 hover:text-charcoal"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT[opt.value]}`} />
                    <div>
                      <span className="block">{opt.label}</span>
                      <span className="block text-[10px] text-stone font-normal">{opt.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Release date (for coming_soon) */}
              {status === "coming_soon" && (
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={stage.release_date?.split("T")[0] ?? ""}
                    onChange={(e) => handleDateChange(stage.id, e.target.value)}
                    disabled={isSaving}
                    className="w-full rounded-lg border border-sand bg-white px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              )}

              {/* Visibility indicator */}
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-stone">
                <span className={`h-1.5 w-1.5 rounded-full ${stage.visible_to_clients ? "bg-emerald-400" : "bg-red-400"}`} />
                {stage.visible_to_clients ? "Visible to clients" : "Hidden from clients"}
              </div>
            </div>
          );
        })}
      </div>

      {stages.length === 0 && (
        <div className="rounded-xl border border-sand bg-sand-light/50 p-12 text-center">
          <p className="text-sm text-stone">
            No stages configured for this project.
          </p>
          <p className="mt-1 text-[11px] text-stone/60">
            Stages are created via the generic grouping system. Add a &quot;Stage&quot; group type and groups for each stage.
          </p>
        </div>
      )}
    </div>
  );
}
