"use client";

import { useState, useMemo } from "react";
import { AdminUnit } from "@/lib/data";

type SortKey = "unit_number" | "stage" | "area" | "beds" | "status" | "price";
type SortDir = "asc" | "desc";

interface UnitPriceTableProps {
  units: AdminUnit[];
  selectedUnits: Set<number>;
  onToggleSelect: (unitNumber: number) => void;
  onSelectAll: () => void;
  onEditPrice: (unitNumber: number) => void;
  onViewHistory: (unitNumber: number) => void;
  currencySymbol: string;
  unitLabelShort: string;
}

function formatPrice(value: number, symbol: string): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${symbol}${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`;
  }
  return `${symbol}${value.toLocaleString()}`;
}

export function UnitPriceTable({
  units,
  selectedUnits,
  onToggleSelect,
  onSelectAll,
  onEditPrice,
  onViewHistory,
  currencySymbol,
  unitLabelShort,
}: UnitPriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("unit_number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filter, setFilter] = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = units;
    if (filter) {
      const q = filter.toLowerCase();
      result = result.filter(
        (u) =>
          String(u.unit_number).includes(q) ||
          u.label.toLowerCase().includes(q) ||
          u.stage.toLowerCase().includes(q) ||
          u.area.toLowerCase().includes(q) ||
          u.status.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "unit_number":
          return (a.unit_number - b.unit_number) * dir;
        case "stage":
          return a.stage.localeCompare(b.stage) * dir;
        case "area":
          return a.area.localeCompare(b.area) * dir;
        case "beds":
          return (a.beds - b.beds) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "price":
          return ((a.current_price?.price_min ?? 0) - (b.current_price?.price_min ?? 0)) * dir;
        default:
          return 0;
      }
    });
  }, [units, filter, sortKey, sortDir]);

  const allSelected = selectedUnits.size === units.length && units.length > 0;

  const SortHeader = ({ label, sortBy }: { label: string; sortBy: SortKey }) => (
    <th
      className="cursor-pointer select-none px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
      onClick={() => handleSort(sortBy)}
    >
      {label}
      {sortKey === sortBy && (
        <span className="ml-1">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>
      )}
    </th>
  );

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search units..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-sand bg-white px-3 py-2 text-sm text-charcoal placeholder:text-stone/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-sand bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-sand bg-sand-light/50">
            <tr>
              <th className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="h-3.5 w-3.5 rounded border-stone/30 accent-gold"
                />
              </th>
              <SortHeader label="Unit" sortBy="unit_number" />
              <SortHeader label="Stage" sortBy="stage" />
              <SortHeader label="Area" sortBy="area" />
              <SortHeader label="Beds" sortBy="beds" />
              <SortHeader label="Status" sortBy="status" />
              <SortHeader label="Current Price" sortBy="price" />
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-stone">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/50">
            {filtered.map((unit) => (
              <tr
                key={unit.unit_number}
                className={`transition-colors hover:bg-sand-light/30 ${
                  selectedUnits.has(unit.unit_number) ? "bg-gold/5" : ""
                }`}
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedUnits.has(unit.unit_number)}
                    onChange={() => onToggleSelect(unit.unit_number)}
                    className="h-3.5 w-3.5 rounded border-stone/30 accent-gold"
                  />
                </td>
                <td className="px-3 py-2 font-medium text-charcoal">
                  {unitLabelShort} {unit.unit_number}
                </td>
                <td className="px-3 py-2 text-charcoal-mid">{unit.stage}</td>
                <td className="px-3 py-2 text-charcoal-mid">{unit.area}</td>
                <td className="px-3 py-2 text-charcoal-mid">{unit.beds}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      unit.status === "available"
                        ? "bg-emerald-50 text-emerald-700"
                        : unit.status === "sold"
                        ? "bg-red-50 text-red-600"
                        : unit.status === "negotiation"
                        ? "bg-amber-50 text-amber-700"
                        : unit.status === "hold"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {unit.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {unit.current_price ? (
                    <div>
                      <span className="font-semibold text-charcoal">
                        {unit.current_price.display_text ??
                          formatPrice(unit.current_price.price_min, currencySymbol)}
                      </span>
                      {unit.current_price.price_min !== unit.current_price.price_max && (
                        <span className="ml-1 text-[10px] text-stone">
                          &ndash; {formatPrice(unit.current_price.price_max, currencySymbol)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-stone/50">No price</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => onEditPrice(unit.unit_number)}
                    className="mr-2 text-[11px] font-medium text-gold hover:text-gold-light transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onViewHistory(unit.unit_number)}
                    className="text-[11px] font-medium text-stone hover:text-charcoal transition-colors"
                  >
                    History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-stone">
            No units match your search.
          </div>
        )}
      </div>
    </div>
  );
}
