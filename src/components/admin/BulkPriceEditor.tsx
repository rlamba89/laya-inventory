"use client";

import { useState, useEffect } from "react";

interface BulkPriceEditorProps {
  selectedUnits: Set<number>;
  projectSlug: string;
  currencySymbol: string;
  onClose: () => void;
  onSaved: () => void;
}

export function BulkPriceEditor({
  selectedUnits,
  projectSlug,
  currencySymbol,
  onClose,
  onSaved,
}: BulkPriceEditorProps) {
  const [adjustmentType, setAdjustmentType] = useState<"percent" | "fixed">("percent");
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    const value = parseFloat(adjustmentValue);
    if (isNaN(value) || value === 0) {
      setError("Please enter a valid adjustment value");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectSlug}/prices/bulk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit_numbers: Array.from(selectedUnits),
          adjustment_type: adjustmentType,
          adjustment_value: adjustmentType === "fixed" ? value : value,
          change_reason: reason || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update prices");
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
      setSaving(false);
    }
  };

  const previewText = () => {
    const value = parseFloat(adjustmentValue);
    if (isNaN(value)) return "Enter a value";
    if (adjustmentType === "percent") {
      return value > 0 ? `+${value}% increase` : `${value}% decrease`;
    }
    const formatted =
      Math.abs(value) >= 1_000_000
        ? `${currencySymbol}${(Math.abs(value) / 1_000_000).toFixed(2)}M`
        : `${currencySymbol}${Math.abs(value).toLocaleString()}`;
    return value > 0 ? `+${formatted} increase` : `-${formatted} decrease`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="font-serif text-lg font-semibold text-charcoal">
          Bulk Price Update
        </h2>
        <p className="mt-1 text-[11px] text-stone">
          Adjusting prices for {selectedUnits.size} unit{selectedUnits.size !== 1 ? "s" : ""}
        </p>

        <div className="mt-5 space-y-4">
          {/* Adjustment Type */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone mb-2">
              Adjustment Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setAdjustmentType("percent")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  adjustmentType === "percent"
                    ? "border-gold bg-gold/10 text-charcoal"
                    : "border-sand text-stone hover:border-gold/50"
                }`}
              >
                Percentage (%)
              </button>
              <button
                onClick={() => setAdjustmentType("fixed")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  adjustmentType === "fixed"
                    ? "border-gold bg-gold/10 text-charcoal"
                    : "border-sand text-stone hover:border-gold/50"
                }`}
              >
                Fixed ({currencySymbol})
              </button>
            </div>
          </div>

          {/* Adjustment Value */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone mb-1">
              {adjustmentType === "percent" ? "Percentage Change" : `Amount (${currencySymbol})`}
            </label>
            <input
              type="number"
              value={adjustmentValue}
              onChange={(e) => setAdjustmentValue(e.target.value)}
              placeholder={adjustmentType === "percent" ? "e.g. 5 for +5%, -3 for -3%" : "e.g. 50000 or -25000"}
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <p className="mt-1 text-[10px] text-stone">
              Use negative values for decreases
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone mb-1">
              Reason for change
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Q2 price revision"
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-sand-light p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">Preview</p>
            <p className="mt-1 text-sm font-semibold text-charcoal">{previewText()}</p>
            <p className="mt-0.5 text-[10px] text-stone">
              Applied to {selectedUnits.size} unit{selectedUnits.size !== 1 ? "s" : ""}
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-warm-white transition-colors hover:bg-charcoal-mid disabled:opacity-50"
          >
            {saving ? "Updating..." : "Apply Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
