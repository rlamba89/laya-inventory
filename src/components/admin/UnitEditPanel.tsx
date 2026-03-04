"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminUnit } from "@/lib/data";
import { UnitPrice } from "@/lib/types";

interface UnitEditPanelProps {
  unit: AdminUnit;
  projectSlug: string;
  unitTypes: { id: string; code: string; name: string | null }[];
  stages: { id: string; name: string }[];
  areas: { id: string; name: string }[];
  currencySymbol: string;
  unitLabelShort: string;
  onClose: () => void;
  onSaved: (updated: AdminUnit) => void;
}

interface UnitDetail {
  label: string;
  beds: number;
  baths: number;
  cars: number;
  status: string;
  unit_type_id: string;
  ground_internal: string;
  ground_garage: string;
  upper_internal: string;
  upper_balcony: string;
  patio: string;
  total_area: string;
  front_yard: string;
  back_yard: string;
  lot_size: string;
  notes: string;
  stage_group_id: string;
  area_group_id: string;
}

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "negotiation", label: "Negotiation" },
  { value: "hold", label: "Hold" },
  { value: "unreleased", label: "Unreleased" },
];

function formatPrice(value: number, symbol: string): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${symbol}${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`;
  }
  return `${symbol}${value.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UnitEditPanel({
  unit,
  projectSlug,
  unitTypes,
  stages,
  areas,
  currencySymbol,
  unitLabelShort,
  onClose,
  onSaved,
}: UnitEditPanelProps) {
  const [form, setForm] = useState<UnitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Price state
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [priceReason, setPriceReason] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [priceSaved, setPriceSaved] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(unit.current_price);

  // Price history
  const [priceHistory, setPriceHistory] = useState<UnitPrice[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadUnit = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectSlug}/units/${unit.unit_number}`);
      if (!res.ok) throw new Error("Failed to load unit details");
      const data = await res.json();
      const u = data.unit;
      const groups = data.groups as Record<string, string>;

      setForm({
        label: u.label ?? "",
        beds: u.beds ?? 0,
        baths: u.baths ?? 0,
        cars: u.cars ?? 0,
        status: u.status ?? "available",
        unit_type_id: u.unit_type_id ?? "",
        ground_internal: u.ground_internal?.toString() ?? "",
        ground_garage: u.ground_garage?.toString() ?? "",
        upper_internal: u.upper_internal?.toString() ?? "",
        upper_balcony: u.upper_balcony?.toString() ?? "",
        patio: u.patio?.toString() ?? "",
        total_area: u.total_area?.toString() ?? "",
        front_yard: u.front_yard?.toString() ?? "",
        back_yard: u.back_yard?.toString() ?? "",
        lot_size: u.lot_size?.toString() ?? "",
        notes: u.notes ?? "",
        stage_group_id: groups.stage ?? "",
        area_group_id: groups.area ?? "",
      });

      // Initialize price fields from current price
      if (unit.current_price) {
        setPriceMin(String(unit.current_price.price_min));
        setPriceMax(String(unit.current_price.price_max));
        setDisplayText(unit.current_price.display_text ?? "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [projectSlug, unit.unit_number, unit.current_price]);

  useEffect(() => {
    loadUnit();
  }, [loadUnit]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setError("");

    try {
      const numOrNull = (v: string) => (v === "" ? null : parseFloat(v));

      const res = await fetch(`/api/projects/${projectSlug}/units/${unit.unit_number}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: form.label,
          beds: form.beds,
          baths: form.baths,
          cars: form.cars,
          status: form.status,
          unit_type_id: form.unit_type_id || null,
          ground_internal: numOrNull(form.ground_internal),
          ground_garage: numOrNull(form.ground_garage),
          upper_internal: numOrNull(form.upper_internal),
          upper_balcony: numOrNull(form.upper_balcony),
          patio: numOrNull(form.patio),
          total_area: numOrNull(form.total_area),
          front_yard: numOrNull(form.front_yard),
          back_yard: numOrNull(form.back_yard),
          lot_size: numOrNull(form.lot_size),
          notes: form.notes || null,
          groups: {
            stage: form.stage_group_id || undefined,
            area: form.area_group_id || undefined,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const selectedType = unitTypes.find((t) => t.id === form.unit_type_id);
      const selectedStage = stages.find((s) => s.id === form.stage_group_id);
      const selectedArea = areas.find((a) => a.id === form.area_group_id);

      onSaved({
        ...unit,
        label: form.label,
        beds: form.beds,
        baths: form.baths,
        status: form.status,
        unit_type_id: form.unit_type_id || null,
        unit_type_code: selectedType?.code ?? null,
        stage: selectedStage?.name ?? unit.stage,
        area: selectedArea?.name ?? unit.area,
        current_price: currentPrice,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePrice() {
    const min = parseInt(priceMin);
    const max = parseInt(priceMax);

    if (isNaN(min) || isNaN(max)) {
      setPriceError("Enter valid prices");
      return;
    }
    if (min > max) {
      setPriceError("Min cannot exceed max");
      return;
    }

    setSavingPrice(true);
    setPriceError("");
    setPriceSaved(false);

    try {
      const res = await fetch(`/api/projects/${projectSlug}/prices/${unit.unit_number}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price_min: min,
          price_max: max,
          display_text: displayText || null,
          change_reason: priceReason || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save price");
      }

      setCurrentPrice({
        price_min: min,
        price_max: max,
        display_text: displayText || null,
        price_type: "base",
      });
      setPriceReason("");
      setPriceSaved(true);
      if (historyOpen) loadHistory();
      setTimeout(() => setPriceSaved(false), 3000);
    } catch (err) {
      setPriceError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingPrice(false);
    }
  }

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectSlug}/prices/${unit.unit_number}`);
      if (res.ok) {
        const data = await res.json();
        setPriceHistory(data);
      }
    } finally {
      setHistoryLoading(false);
    }
  }

  function toggleHistory() {
    if (!historyOpen) loadHistory();
    setHistoryOpen(!historyOpen);
  }

  const pricePreview = (() => {
    const min = parseInt(priceMin);
    const max = parseInt(priceMax);
    if (displayText) return displayText;
    if (isNaN(min)) return "—";
    if (isNaN(max) || min === max) return formatPrice(min, currencySymbol);
    return `${formatPrice(min, currencySymbol)} – ${formatPrice(max, currencySymbol)}`;
  })();

  function updateField<K extends keyof UnitDetail>(key: K, value: UnitDetail[K]) {
    if (!form) return;
    setForm({ ...form, [key]: value });
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-charcoal/30" onClick={onClose} />

      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-sand bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-charcoal">
              {unitLabelShort} {unit.unit_number}
            </h2>
            <p className="text-xs text-stone">{unit.label}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-stone hover:bg-sand hover:text-charcoal transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : !form ? (
            <p className="text-sm text-red-600">{error || "Failed to load unit"}</p>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              {/* Basic Info */}
              <Section title="Basic Info">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Label" className="col-span-2">
                    <input type="text" value={form.label} onChange={(e) => updateField("label", e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className={inputClass}>
                      {STATUS_OPTIONS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                    </select>
                  </Field>
                  <Field label="Type">
                    <select value={form.unit_type_id} onChange={(e) => updateField("unit_type_id", e.target.value)} className={inputClass}>
                      <option value="">Unassigned</option>
                      {unitTypes.map((ut) => (<option key={ut.id} value={ut.id}>{ut.code}{ut.name ? ` - ${ut.name}` : ""}</option>))}
                    </select>
                  </Field>
                </div>
              </Section>

              {/* Configuration */}
              <Section title="Configuration">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Beds">
                    <input type="number" value={form.beds} onChange={(e) => updateField("beds", parseInt(e.target.value) || 0)} min="0" className={inputClass} />
                  </Field>
                  <Field label="Baths">
                    <input type="number" value={form.baths} onChange={(e) => updateField("baths", parseInt(e.target.value) || 0)} min="0" className={inputClass} />
                  </Field>
                  <Field label="Cars">
                    <input type="number" value={form.cars} onChange={(e) => updateField("cars", parseInt(e.target.value) || 0)} min="0" className={inputClass} />
                  </Field>
                </div>
              </Section>

              {/* Grouping */}
              <Section title="Grouping">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Stage">
                    <select value={form.stage_group_id} onChange={(e) => updateField("stage_group_id", e.target.value)} className={inputClass}>
                      <option value="">None</option>
                      {stages.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                  </Field>
                  <Field label="Area">
                    <select value={form.area_group_id} onChange={(e) => updateField("area_group_id", e.target.value)} className={inputClass}>
                      <option value="">None</option>
                      {areas.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
                    </select>
                  </Field>
                </div>
              </Section>

              {/* Pricing */}
              <Section title="Pricing">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={`Price Min (${currencySymbol})`}>
                      <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="e.g. 1600000" className={inputClass} />
                    </Field>
                    <Field label={`Price Max (${currencySymbol})`}>
                      <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="e.g. 1620000" className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Display Text (optional override)">
                    <input type="text" value={displayText} onChange={(e) => setDisplayText(e.target.value)} placeholder="e.g. $1.60M or From $1.6M" className={inputClass} />
                  </Field>
                  <Field label="Reason for change">
                    <input type="text" value={priceReason} onChange={(e) => setPriceReason(e.target.value)} placeholder="e.g. Market adjustment" className={inputClass} />
                  </Field>

                  {/* Preview + save */}
                  <div className="flex items-center justify-between rounded-lg bg-sand-light px-3 py-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">Preview</p>
                      <p className="font-sans text-base font-bold text-charcoal">{pricePreview}</p>
                    </div>
                    <button
                      onClick={handleSavePrice}
                      disabled={savingPrice}
                      className="rounded-lg bg-charcoal px-3 py-1.5 text-xs font-medium text-warm-white hover:bg-charcoal-mid transition-colors disabled:opacity-50"
                    >
                      {savingPrice ? "..." : "Update Price"}
                    </button>
                  </div>

                  {priceSaved && (
                    <p className="text-xs text-emerald-600 font-medium">Price updated successfully</p>
                  )}
                  {priceError && (
                    <p className="text-xs text-red-600">{priceError}</p>
                  )}

                  {/* History toggle */}
                  <button
                    onClick={toggleHistory}
                    className="text-[11px] font-medium text-stone hover:text-charcoal transition-colors"
                  >
                    {historyOpen ? "Hide" : "Show"} price history
                  </button>

                  {historyOpen && (
                    <div className="rounded-lg border border-sand p-3">
                      {historyLoading ? (
                        <p className="text-xs text-stone py-2">Loading...</p>
                      ) : priceHistory.length === 0 ? (
                        <p className="text-xs text-stone py-2">No price history</p>
                      ) : (
                        <div className="relative">
                          <div className="absolute left-2 top-1 bottom-1 w-px bg-sand" />
                          <div className="space-y-3">
                            {priceHistory.map((price, i) => (
                              <div key={price.id} className="relative pl-6">
                                <div
                                  className={`absolute left-0.5 top-1 h-2.5 w-2.5 rounded-full border-2 ${
                                    price.is_current ? "border-gold bg-gold" : "border-sand bg-white"
                                  }`}
                                />
                                <div>
                                  <p className="text-xs font-semibold text-charcoal">
                                    {price.display_text ?? formatPrice(price.price_min, currencySymbol)}
                                    {price.price_min !== price.price_max && (
                                      <span className="font-normal text-stone"> – {formatPrice(price.price_max, currencySymbol)}</span>
                                    )}
                                    {price.is_current && (
                                      <span className="ml-1.5 rounded-full bg-gold/20 px-1.5 py-px text-[8px] font-semibold uppercase text-gold">Current</span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-stone">
                                    {formatDate(price.effective_from)}
                                    {price.change_reason && <span className="text-charcoal-mid"> — {price.change_reason}</span>}
                                  </p>
                                  {i < priceHistory.length - 1 && (() => {
                                    const prev = priceHistory[i + 1];
                                    const diff = price.price_min - prev.price_min;
                                    const pct = prev.price_min > 0 ? ((diff / prev.price_min) * 100).toFixed(1) : "0";
                                    if (diff > 0) return <p className="text-[10px] text-emerald-600">+{formatPrice(diff, currencySymbol)} (+{pct}%)</p>;
                                    if (diff < 0) return <p className="text-[10px] text-red-500">{formatPrice(diff, currencySymbol)} ({pct}%)</p>;
                                    return null;
                                  })()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Section>

              {/* Dimensions */}
              <Section title="Dimensions (m²)">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ground Internal">
                    <input type="number" value={form.ground_internal} onChange={(e) => updateField("ground_internal", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Ground Garage">
                    <input type="number" value={form.ground_garage} onChange={(e) => updateField("ground_garage", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Upper Internal">
                    <input type="number" value={form.upper_internal} onChange={(e) => updateField("upper_internal", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Upper Balcony">
                    <input type="number" value={form.upper_balcony} onChange={(e) => updateField("upper_balcony", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Patio">
                    <input type="number" value={form.patio} onChange={(e) => updateField("patio", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Total Area">
                    <input type="number" value={form.total_area} onChange={(e) => updateField("total_area", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Front Yard">
                    <input type="number" value={form.front_yard} onChange={(e) => updateField("front_yard", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Back Yard">
                    <input type="number" value={form.back_yard} onChange={(e) => updateField("back_yard", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                  <Field label="Lot Size" className="col-span-2">
                    <input type="number" value={form.lot_size} onChange={(e) => updateField("lot_size", e.target.value)} step="0.1" className={inputClass} />
                  </Field>
                </div>
              </Section>

              {/* Notes */}
              <Section title="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={3}
                  placeholder="Internal notes about this unit..."
                  className={`${inputClass} resize-none`}
                />
              </Section>
            </div>
          )}
        </div>

        {/* Footer */}
        {form && (
          <div className="flex items-center gap-3 border-t border-sand px-6 py-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-charcoal px-5 py-2 text-sm font-medium text-warm-white hover:bg-charcoal-mid transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-stone hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const inputClass =
  "w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-stone">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[10px] font-medium text-stone">{label}</label>
      {children}
    </div>
  );
}
