"use client";

import { useState, useMemo } from "react";
import { AdminUnit } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { UnitEditPanel } from "./UnitEditPanel";

interface UnitsTableProps {
  initialUnits: AdminUnit[];
  projectSlug: string;
  unitTypes?: { id: string; code: string; name: string | null }[];
  stages?: { id: string; name: string }[];
  areas?: { id: string; name: string }[];
  currencySymbol?: string;
  unitLabelShort?: string;
}

type SortField = "unit_number" | "beds" | "status" | "stage" | "area" | "price" | "type";
type SortDir = "asc" | "desc";

const STATUS_BADGE: Record<string, string> = {
  available: "bg-available/20 text-available",
  sold: "bg-sold/20 text-sold",
  negotiation: "bg-negotiation/20 text-negotiation",
  hold: "bg-hold/20 text-hold",
  unreleased: "bg-stone/20 text-stone",
};

export function UnitsTable({
  initialUnits,
  projectSlug,
  unitTypes = [],
  stages = [],
  areas = [],
  currencySymbol = "$",
  unitLabelShort = "TH",
}: UnitsTableProps) {
  const [units, setUnits] = useState(initialUnits);
  const [sortField, setSortField] = useState<SortField>("unit_number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editingUnit, setEditingUnit] = useState<AdminUnit | null>(null);

  const stageNames = useMemo(() => [...new Set(units.map((u) => u.stage))].sort(), [units]);
  const typeOptions = useMemo(
    () => [...new Set(units.map((u) => u.unit_type_code).filter(Boolean))].sort(),
    [units]
  );

  const filtered = useMemo(() => {
    let result = units;
    if (filterStatus !== "all") result = result.filter((u) => u.status === filterStatus);
    if (filterStage !== "all") result = result.filter((u) => u.stage === filterStage);
    if (filterType !== "all") {
      if (filterType === "unassigned") {
        result = result.filter((u) => !u.unit_type_code);
      } else {
        result = result.filter((u) => u.unit_type_code === filterType);
      }
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.label.toLowerCase().includes(q) ||
          String(u.unit_number).includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "unit_number":
          return (a.unit_number - b.unit_number) * dir;
        case "beds":
          return (a.beds - b.beds) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "stage":
          return a.stage.localeCompare(b.stage) * dir;
        case "area":
          return a.area.localeCompare(b.area) * dir;
        case "type":
          return (a.unit_type_code ?? "").localeCompare(b.unit_type_code ?? "") * dir;
        case "price":
          return ((a.current_price?.price_min ?? 0) - (b.current_price?.price_min ?? 0)) * dir;
        default:
          return 0;
      }
    });
  }, [units, filterStatus, filterStage, filterType, search, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " \u2191" : " \u2193";
  }

  function handleUnitSaved(updated: AdminUnit) {
    setUnits((prev) =>
      prev.map((u) => (u.unit_number === updated.unit_number ? updated : u))
    );
    setEditingUnit(null);
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const u of units) {
      c[u.status] = (c[u.status] || 0) + 1;
    }
    return c;
  }, [units]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Units</h1>
        <p className="mt-1 text-sm text-stone">
          {units.length} total units &middot;{" "}
          {counts.available || 0} available &middot;{" "}
          {counts.sold || 0} sold
          <span className="ml-2 text-stone/60">&middot; Click a row to edit</span>
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/60 focus:border-terracotta focus:outline-none"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal focus:border-terracotta focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="negotiation">Negotiation</option>
          <option value="hold">Hold</option>
        </select>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal focus:border-terracotta focus:outline-none"
        >
          <option value="all">All Stages</option>
          {stageNames.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {unitTypes.length > 0 && (
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="unassigned">Unassigned</option>
            {typeOptions.map((t) => (
              <option key={t} value={t!}>{t}</option>
            ))}
          </select>
        )}
        <span className="ml-auto text-xs text-stone">
          {filtered.length} of {units.length} shown
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-sand">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand bg-sand-light text-left">
              <th
                className="cursor-pointer px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
                onClick={() => toggleSort("unit_number")}
              >
                Unit{sortIndicator("unit_number")}
              </th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone">
                Label
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
                onClick={() => toggleSort("type")}
              >
                Type{sortIndicator("type")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
                onClick={() => toggleSort("stage")}
              >
                Stage{sortIndicator("stage")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
                onClick={() => toggleSort("area")}
              >
                Area{sortIndicator("area")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
                onClick={() => toggleSort("beds")}
              >
                Beds{sortIndicator("beds")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
                onClick={() => toggleSort("price")}
              >
                Price{sortIndicator("price")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-stone hover:text-charcoal"
                onClick={() => toggleSort("status")}
              >
                Status{sortIndicator("status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.unit_number}
                onClick={() => setEditingUnit(u)}
                className="cursor-pointer border-b border-sand/50 last:border-0 hover:bg-sand-light/50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs font-semibold text-charcoal">
                  {u.unit_number}
                </td>
                <td className="px-4 py-3 text-charcoal-mid">{u.label}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      u.unit_type_code
                        ? "bg-gold/10 text-charcoal"
                        : "bg-stone/10 text-stone"
                    }`}
                  >
                    {u.unit_type_code ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal-mid">{u.stage}</td>
                <td className="px-4 py-3 text-charcoal-mid">{u.area}</td>
                <td className="px-4 py-3 text-charcoal-mid">{u.beds}B/{u.baths}B</td>
                <td className="px-4 py-3 font-medium text-charcoal">
                  {u.current_price
                    ? formatCurrency(u.current_price.price_min)
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      STATUS_BADGE[u.status] ?? "bg-stone/20 text-stone"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-stone">
                  No units match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Panel */}
      {editingUnit && (
        <UnitEditPanel
          unit={editingUnit}
          projectSlug={projectSlug}
          unitTypes={unitTypes}
          stages={stages}
          areas={areas}
          currencySymbol={currencySymbol}
          unitLabelShort={unitLabelShort}
          onClose={() => setEditingUnit(null)}
          onSaved={handleUnitSaved}
        />
      )}
    </div>
  );
}
