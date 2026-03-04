"use client";

import { useState, useEffect, useRef } from "react";

interface PriceEditDialogProps {
  unitNumber: number;
  currentPrice: {
    price_min: number;
    price_max: number;
    display_text: string | null;
    price_type: string;
  } | null;
  projectSlug: string;
  currencySymbol: string;
  unitLabelShort: string;
  onClose: () => void;
  onSaved: (unitNumber: number, newPrice: { price_min: number; price_max: number; display_text: string | null }) => void;
}

export function PriceEditDialog({
  unitNumber,
  currentPrice,
  projectSlug,
  currencySymbol,
  unitLabelShort,
  onClose,
  onSaved,
}: PriceEditDialogProps) {
  const [priceMin, setPriceMin] = useState(String(currentPrice?.price_min ?? ""));
  const [priceMax, setPriceMax] = useState(String(currentPrice?.price_max ?? ""));
  const [displayText, setDisplayText] = useState(currentPrice?.display_text ?? "");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    const min = parseInt(priceMin);
    const max = parseInt(priceMax);

    if (isNaN(min) || isNaN(max)) {
      setError("Please enter valid prices");
      return;
    }
    if (min > max) {
      setError("Minimum price cannot exceed maximum");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectSlug}/prices/${unitNumber}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price_min: min,
          price_max: max,
          display_text: displayText || null,
          change_reason: reason || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save price");
      }

      onSaved(unitNumber, { price_min: min, price_max: max, display_text: displayText || null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const formatPreview = () => {
    const min = parseInt(priceMin);
    const max = parseInt(priceMax);
    if (displayText) return displayText;
    if (isNaN(min)) return "—";
    const fmt = (v: number) => {
      if (v >= 1_000_000) {
        const m = v / 1_000_000;
        return `${currencySymbol}${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`;
      }
      return `${currencySymbol}${v.toLocaleString()}`;
    };
    if (isNaN(max) || min === max) return fmt(min);
    return `${fmt(min)} – ${fmt(max)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="font-serif text-lg font-semibold text-charcoal">
          Edit Price — {unitLabelShort} {unitNumber}
        </h2>

        {currentPrice && (
          <p className="mt-1 text-[11px] text-stone">
            Current: {currentPrice.display_text ?? `${currencySymbol}${currentPrice.price_min.toLocaleString()}`}
          </p>
        )}

        <div className="mt-5 space-y-4">
          {/* Price Min */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone mb-1">
              Price Min ({currencySymbol})
            </label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="e.g. 1600000"
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Price Max */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone mb-1">
              Price Max ({currencySymbol})
            </label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="e.g. 1620000"
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Display Text Override */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone mb-1">
              Display Text <span className="font-normal normal-case tracking-normal">(optional override)</span>
            </label>
            <input
              type="text"
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
              placeholder="e.g. $1.60M or From $1.6M"
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
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
              placeholder="e.g. Market adjustment, Stage 2 release"
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-sand-light p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">Preview</p>
            <p className="mt-1 font-sans text-lg font-bold text-charcoal">{formatPreview()}</p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
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
            {saving ? "Saving..." : "Save Price"}
          </button>
        </div>
      </div>
    </div>
  );
}
