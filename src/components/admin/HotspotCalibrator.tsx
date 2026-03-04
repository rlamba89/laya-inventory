"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { HotspotUnit } from "@/lib/data";
import { STATUS_CONFIG } from "@/lib/constants";
import { UnitStatus } from "@/lib/types";

type PlacementMode = "select" | "sequential";

interface HotspotCalibratorProps {
  projectSlug: string;
  siteplanUrl: string | null;
  siteplanWidth: number | null;
  siteplanHeight: number | null;
  initialUnits: HotspotUnit[];
}

export function HotspotCalibrator({
  projectSlug,
  siteplanUrl: initialSiteplanUrl,
  siteplanWidth: initialWidth,
  siteplanHeight: initialHeight,
  initialUnits,
}: HotspotCalibratorProps) {
  const [units, setUnits] = useState<HotspotUnit[]>(initialUnits);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [siteplanUrl, setSiteplanUrl] = useState(initialSiteplanUrl);
  const [siteplanWidth, setSiteplanWidth] = useState(initialWidth);
  const [siteplanHeight, setSiteplanHeight] = useState(initialHeight);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showPlacedOnly, setShowPlacedOnly] = useState<"all" | "placed" | "unplaced">("all");

  // Mode state
  const [mode, setMode] = useState<PlacementMode>("select");
  const [nextId, setNextId] = useState(1);
  const [undoStack, setUndoStack] = useState<{ unit_number: number; prevX: number | null; prevY: number | null }[]>([]);

  const imgRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placedCount = units.filter((u) => u.hotspot_x != null).length;
  const unitNumbers = useMemo(() => new Set(units.map((u) => u.unit_number)), [units]);

  const filteredUnits = useMemo(() => {
    let list = units;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          String(u.unit_number).includes(q) ||
          u.label.toLowerCase().includes(q)
      );
    }
    if (showPlacedOnly === "placed") list = list.filter((u) => u.hotspot_x != null);
    if (showPlacedOnly === "unplaced") list = list.filter((u) => u.hotspot_x == null);
    return list;
  }, [units, search, showPlacedOnly]);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // Save a hotspot to the API
  const saveHotspot = useCallback(
    async (unitNumber: number, x: number | null, y: number | null) => {
      const res = await fetch(`/api/projects/${projectSlug}/hotspots`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unit_number: unitNumber, hotspot_x: x, hotspot_y: y }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }
    },
    [projectSlug]
  );

  const handleSiteplanClick = useCallback(
    async (e: React.MouseEvent) => {
      if (!imgRef.current) return;

      // Determine which unit to place
      const targetUnit = mode === "sequential" ? nextId : selectedUnit;
      if (targetUnit == null) return;

      // Validate unit exists
      if (!unitNumbers.has(targetUnit)) {
        showMessage("error", `Unit #${targetUnit} does not exist`);
        return;
      }

      const rect = imgRef.current.getBoundingClientRect();
      const x = +((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
      const y = +((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

      // Track previous position for undo
      const prevUnit = units.find((u) => u.unit_number === targetUnit);
      const prevX = prevUnit?.hotspot_x ?? null;
      const prevY = prevUnit?.hotspot_y ?? null;

      // Optimistically update
      setUnits((prev) =>
        prev.map((u) =>
          u.unit_number === targetUnit ? { ...u, hotspot_x: x, hotspot_y: y } : u
        )
      );

      setSaving(targetUnit);

      try {
        await saveHotspot(targetUnit, x, y);
        showMessage("success", `#${targetUnit} placed at (${x}%, ${y}%)`);

        // Push to undo stack
        setUndoStack((prev) => [...prev, { unit_number: targetUnit, prevX, prevY }]);

        if (mode === "sequential") {
          // Auto-increment to next unit number
          const sortedNums = units.map((u) => u.unit_number).sort((a, b) => a - b);
          const currentIdx = sortedNums.indexOf(targetUnit);
          if (currentIdx >= 0 && currentIdx < sortedNums.length - 1) {
            setNextId(sortedNums[currentIdx + 1]);
          } else {
            setNextId(targetUnit + 1);
          }
        } else {
          // Select mode: auto-advance to next unplaced
          const currentIdx = units.findIndex((u) => u.unit_number === targetUnit);
          const nextUnplaced = units.find(
            (u, i) => i > currentIdx && u.hotspot_x == null
          );
          setSelectedUnit(nextUnplaced?.unit_number ?? null);
        }
      } catch (err) {
        // Revert
        setUnits((prev) =>
          prev.map((u) =>
            u.unit_number === targetUnit ? { ...u, hotspot_x: prevX, hotspot_y: prevY } : u
          )
        );
        showMessage("error", err instanceof Error ? err.message : "Failed to save");
      } finally {
        setSaving(null);
      }
    },
    [mode, nextId, selectedUnit, units, unitNumbers, saveHotspot, showMessage]
  );

  const handleUndo = useCallback(async () => {
    if (undoStack.length === 0) return;

    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    // Revert local state
    setUnits((prev) =>
      prev.map((u) =>
        u.unit_number === last.unit_number
          ? { ...u, hotspot_x: last.prevX, hotspot_y: last.prevY }
          : u
      )
    );

    // Revert in DB
    try {
      await saveHotspot(last.unit_number, last.prevX, last.prevY);
      showMessage("success", `Undid #${last.unit_number}`);

      // In sequential mode, go back to that unit number
      if (mode === "sequential") {
        setNextId(last.unit_number);
      }
    } catch {
      showMessage("error", "Failed to undo");
    }
  }, [undoStack, saveHotspot, showMessage, mode]);

  const handleRemoveHotspot = useCallback(
    async (unitNumber: number) => {
      const prev = units.find((u) => u.unit_number === unitNumber);
      setUnits((us) =>
        us.map((u) =>
          u.unit_number === unitNumber ? { ...u, hotspot_x: null, hotspot_y: null } : u
        )
      );

      try {
        await saveHotspot(unitNumber, null, null);
        showMessage("success", `Unit ${unitNumber} hotspot removed`);
      } catch {
        if (prev) {
          setUnits((us) =>
            us.map((u) => (u.unit_number === unitNumber ? prev : u))
          );
        }
        showMessage("error", "Failed to remove hotspot");
      }
    },
    [units, saveHotspot, showMessage]
  );

  const handleUploadSiteplan = useCallback(
    async (file: File) => {
      setUploading(true);

      const img = new window.Image();
      const url = URL.createObjectURL(file);

      const dims = await new Promise<{ w: number; h: number }>((resolve) => {
        img.onload = () => {
          resolve({ w: img.naturalWidth, h: img.naturalHeight });
          URL.revokeObjectURL(url);
        };
        img.src = url;
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("width", String(dims.w));
      formData.append("height", String(dims.h));

      try {
        const res = await fetch(`/api/projects/${projectSlug}/hotspots`, {
          method: "PUT",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Upload failed");
        }

        const data = await res.json();
        setSiteplanUrl(data.siteplan_image_url);
        setSiteplanWidth(data.siteplan_width);
        setSiteplanHeight(data.siteplan_height);
        showMessage("success", "Siteplan updated");
      } catch (err) {
        showMessage("error", err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [projectSlug, showMessage]
  );

  const handleClearAll = useCallback(async () => {
    if (!confirm("Remove all hotspot positions? This cannot be undone.")) return;

    const backup = [...units];
    setClearing(true);
    setUnits((prev) => prev.map((u) => ({ ...u, hotspot_x: null, hotspot_y: null })));
    setUndoStack([]);

    try {
      const res = await fetch(`/api/projects/${projectSlug}/hotspots`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "All hotspots cleared");
    } catch {
      setUnits(backup);
      showMessage("error", "Failed to clear hotspots");
    } finally {
      setClearing(false);
    }
  }, [projectSlug, units, showMessage]);

  const isActive = mode === "sequential" ? unitNumbers.has(nextId) : selectedUnit != null;

  return (
    <div className="flex h-screen">
      {/* Left panel — unit list */}
      <div className="flex w-64 shrink-0 flex-col border-r border-sand bg-white">
        <div className="border-b border-sand px-4 py-4">
          <h1 className="font-serif text-lg font-semibold text-charcoal">
            Siteplan & Hotspots
          </h1>
          <p className="mt-1 text-[11px] text-stone">
            {placedCount}/{units.length} units placed
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-sand">
            <div
              className="h-1.5 rounded-full bg-olive transition-all"
              style={{ width: `${units.length > 0 ? (placedCount / units.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Mode toggle */}
        <div className="border-b border-sand px-4 py-3">
          <div className="flex rounded-lg bg-sand-light p-0.5">
            {(["select", "sequential"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  if (m === "sequential") setSelectedUnit(null);
                }}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${
                  mode === m
                    ? "bg-charcoal text-warm-white shadow-sm"
                    : "text-stone hover:text-charcoal"
                }`}
              >
                {m === "select" ? "Select" : "Sequential"}
              </button>
            ))}
          </div>

          {/* Sequential mode controls */}
          {mode === "sequential" && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-medium text-charcoal">Next ID:</label>
                <input
                  type="number"
                  value={nextId}
                  onChange={(e) => setNextId(+e.target.value)}
                  min={1}
                  className="w-20 rounded-lg border border-sand bg-white px-2 py-1 text-sm font-semibold text-charcoal focus:border-charcoal-mid focus:outline-none"
                />
                {!unitNumbers.has(nextId) && (
                  <span className="text-[9px] text-red-500">invalid</span>
                )}
              </div>
              {undoStack.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-1 rounded-md bg-sand-light px-2 py-1 text-[10px] font-medium text-stone hover:bg-sand hover:text-charcoal"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 10h10a5 5 0 0 1 0 10H9" />
                    <path d="M3 10l4-4M3 10l4 4" />
                  </svg>
                  Undo last ({undoStack.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search + filter (only in select mode) */}
        {mode === "select" && (
          <div className="border-b border-sand px-4 py-3 space-y-2">
            <input
              type="text"
              placeholder="Search units..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-sand-light px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/50 focus:border-charcoal-mid focus:outline-none"
            />
            <div className="flex gap-1">
              {(["all", "unplaced", "placed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setShowPlacedOnly(f)}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    showPlacedOnly === f
                      ? "bg-charcoal text-warm-white"
                      : "bg-sand-light text-stone hover:bg-sand"
                  }`}
                >
                  {f === "all" ? "All" : f === "placed" ? "Placed" : "Unplaced"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unit list */}
        <div className="flex-1 overflow-y-auto">
          {filteredUnits.map((unit) => {
            const isSelected =
              mode === "select"
                ? selectedUnit === unit.unit_number
                : nextId === unit.unit_number;
            const isPlaced = unit.hotspot_x != null;
            const isSaving = saving === unit.unit_number;

            return (
              <div
                key={unit.unit_number}
                className={`flex items-center gap-2 border-b border-sand/50 px-4 py-2 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-terracotta/10 border-l-2 border-l-terracotta"
                    : "hover:bg-sand-light"
                }`}
                onClick={() => {
                  if (mode === "select") {
                    setSelectedUnit(isSelected ? null : unit.unit_number);
                  } else {
                    setNextId(unit.unit_number);
                  }
                }}
              >
                {/* Status indicator */}
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    isPlaced ? "" : "border-2 border-dashed border-stone/40"
                  }`}
                  style={
                    isPlaced
                      ? { backgroundColor: STATUS_CONFIG[unit.status as UnitStatus]?.color ?? "#888" }
                      : undefined
                  }
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-charcoal">
                      #{unit.unit_number}
                    </span>
                    {isSaving && (
                      <span className="text-[9px] text-terracotta">saving...</span>
                    )}
                  </div>
                  <p className="truncate text-[10px] text-stone">{unit.label}</p>
                </div>

                {isPlaced && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveHotspot(unit.unit_number);
                    }}
                    className="shrink-0 rounded p-1 text-stone/50 hover:bg-sand hover:text-charcoal"
                    title="Remove hotspot"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="border-t border-sand px-4 py-3">
          {mode === "sequential" ? (
            <p className="text-[11px] text-terracotta font-medium">
              {unitNumbers.has(nextId)
                ? `Click siteplan to place #${nextId}, then auto-advances`
                : "Set a valid unit ID above"}
            </p>
          ) : selectedUnit ? (
            <p className="text-[11px] text-terracotta font-medium">
              Click on the siteplan to place unit #{selectedUnit}
            </p>
          ) : (
            <p className="text-[11px] text-stone">
              Select a unit, then click to place
            </p>
          )}
        </div>
      </div>

      {/* Right panel — siteplan */}
      <div className="flex flex-1 flex-col overflow-hidden bg-charcoal">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-charcoal-mid/30 px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-charcoal-mid/50 px-3 py-1.5 text-[11px] font-medium text-warm-white transition-colors hover:bg-charcoal-mid disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Change Siteplan"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadSiteplan(file);
                e.target.value = "";
              }}
            />
            {placedCount > 0 && (
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="rounded-lg bg-red-500/20 px-3 py-1.5 text-[11px] font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50"
              >
                {clearing ? "Clearing..." : "Clear All"}
              </button>
            )}
            {siteplanWidth && siteplanHeight && (
              <span className="text-[10px] text-stone">
                {siteplanWidth} x {siteplanHeight}px
              </span>
            )}
          </div>

          {/* Message */}
          {message && (
            <span
              className={`rounded-lg px-3 py-1 text-[11px] font-medium ${
                message.type === "success"
                  ? "bg-olive/20 text-olive"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </span>
          )}
        </div>

        {/* Siteplan image */}
        <div className="flex-1 overflow-auto p-4">
          {siteplanUrl ? (
            <div
              ref={imgRef}
              className={`relative inline-block ${
                isActive ? "cursor-crosshair" : "cursor-default"
              }`}
              onClick={handleSiteplanClick}
            >
              <Image
                src={siteplanUrl}
                alt="Site Plan"
                width={siteplanWidth ?? 1984}
                height={siteplanHeight ?? 1083}
                className="h-auto w-full max-w-none"
                priority
                draggable={false}
              />

              {/* Rendered hotspots */}
              {units
                .filter((u) => u.hotspot_x != null && u.hotspot_y != null)
                .map((u) => {
                  const isSelected =
                    mode === "select"
                      ? selectedUnit === u.unit_number
                      : nextId === u.unit_number;
                  return (
                    <button
                      key={u.unit_number}
                      className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[8px] font-bold text-white ring-1 transition-all ${
                        isSelected
                          ? "h-6 w-6 ring-2 ring-warm-white scale-125"
                          : "h-4 w-4 ring-white/40 hover:scale-125 hover:ring-warm-white"
                      }`}
                      style={{
                        left: `${u.hotspot_x}%`,
                        top: `${u.hotspot_y}%`,
                        backgroundColor:
                          STATUS_CONFIG[u.status as UnitStatus]?.color ?? "#888",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (mode === "select") {
                          setSelectedUnit(
                            isSelected ? null : u.unit_number
                          );
                        } else {
                          setNextId(u.unit_number);
                        }
                      }}
                      title={`#${u.unit_number} — ${u.label}`}
                    >
                      {u.unit_number}
                    </button>
                  );
                })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-warm-white/70">
                  No siteplan uploaded
                </p>
                <p className="mt-1 text-sm text-stone">
                  Click &quot;Change Siteplan&quot; to upload an image
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
