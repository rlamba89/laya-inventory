"use client";

import { useState, useEffect } from "react";
import { UnitPrice } from "@/lib/types";

interface PriceHistoryPanelProps {
  unitNumber: number;
  projectSlug: string;
  currencySymbol: string;
  unitLabelShort: string;
  onClose: () => void;
}

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

export function PriceHistoryPanel({
  unitNumber,
  projectSlug,
  currencySymbol,
  unitLabelShort,
  onClose,
}: PriceHistoryPanelProps) {
  const [prices, setPrices] = useState<UnitPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/projects/${projectSlug}/prices/${unitNumber}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPrices(data);
      } catch {
        setError("Failed to load price history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [projectSlug, unitNumber]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-sand px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-charcoal">
            Price History — {unitLabelShort} {unitNumber}
          </h2>
          <p className="mt-0.5 text-[11px] text-stone">
            {prices.length} record{prices.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="py-12 text-center text-sm text-stone">Loading...</div>
          )}
          {error && (
            <div className="py-12 text-center text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && prices.length === 0 && (
            <div className="py-12 text-center text-sm text-stone">No price history</div>
          )}
          {!loading && !error && prices.length > 0 && (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-2 bottom-2 w-px bg-sand" />

              <div className="space-y-4">
                {prices.map((price, i) => (
                  <div key={price.id} className="relative pl-8">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 ${
                        price.is_current
                          ? "border-gold bg-gold"
                          : "border-sand bg-white"
                      }`}
                    />

                    <div
                      className={`rounded-lg border p-3 ${
                        price.is_current
                          ? "border-gold/30 bg-gold/5"
                          : "border-sand bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-charcoal">
                            {price.display_text ?? formatPrice(price.price_min, currencySymbol)}
                            {price.price_min !== price.price_max && (
                              <span className="font-normal text-stone">
                                {" "}– {formatPrice(price.price_max, currencySymbol)}
                              </span>
                            )}
                          </p>
                          {price.is_current && (
                            <span className="inline-block mt-1 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-semibold uppercase text-gold">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone shrink-0 ml-3">
                          {price.price_type}
                        </span>
                      </div>

                      <div className="mt-2 space-y-0.5 text-[10px] text-stone">
                        <p>From: {formatDate(price.effective_from)}</p>
                        {price.effective_to && (
                          <p>To: {formatDate(price.effective_to)}</p>
                        )}
                        {price.changed_by && <p>By: {price.changed_by}</p>}
                        {price.change_reason && (
                          <p className="text-charcoal-mid">Reason: {price.change_reason}</p>
                        )}
                      </div>

                      {/* Price change indicator */}
                      {i < prices.length - 1 && (
                        <div className="mt-2 text-[10px]">
                          {(() => {
                            const prev = prices[i + 1];
                            const diff = price.price_min - prev.price_min;
                            const pct = prev.price_min > 0 ? ((diff / prev.price_min) * 100).toFixed(1) : "0";
                            if (diff > 0) return <span className="text-emerald-600">+{formatPrice(diff, currencySymbol)} (+{pct}%)</span>;
                            if (diff < 0) return <span className="text-red-500">{formatPrice(diff, currencySymbol)} ({pct}%)</span>;
                            return <span className="text-stone">No change</span>;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-sand px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone hover:text-charcoal transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
