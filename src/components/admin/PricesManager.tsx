"use client";

import { useState, useCallback } from "react";
import { AdminUnit } from "@/lib/data";
import { useProject } from "@/providers/ProjectProvider";
import { UnitPriceTable } from "./UnitPriceTable";
import { PriceEditDialog } from "./PriceEditDialog";
import { BulkPriceEditor } from "./BulkPriceEditor";
import { PriceHistoryPanel } from "./PriceHistoryPanel";

interface PricesManagerProps {
  initialUnits: AdminUnit[];
  projectSlug: string;
}

export function PricesManager({ initialUnits, projectSlug }: PricesManagerProps) {
  const { project } = useProject();
  const [units, setUnits] = useState(initialUnits);
  const [selectedUnits, setSelectedUnits] = useState<Set<number>>(new Set());
  const [editingUnit, setEditingUnit] = useState<number | null>(null);
  const [historyUnit, setHistoryUnit] = useState<number | null>(null);
  const [showBulkEditor, setShowBulkEditor] = useState(false);

  const handlePriceUpdated = useCallback(async (unitNumber: number, newPrice: { price_min: number; price_max: number; display_text: string | null }) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.unit_number === unitNumber
          ? { ...u, current_price: { ...newPrice, price_type: "base" } }
          : u
      )
    );
    setEditingUnit(null);
  }, []);

  const handleBulkUpdated = useCallback(() => {
    setShowBulkEditor(false);
    setSelectedUnits(new Set());
    // Reload to get fresh data
    window.location.reload();
  }, []);

  const toggleSelect = useCallback((unitNumber: number) => {
    setSelectedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitNumber)) next.delete(unitNumber);
      else next.add(unitNumber);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedUnits.size === units.length) {
      setSelectedUnits(new Set());
    } else {
      setSelectedUnits(new Set(units.map((u) => u.unit_number)));
    }
  }, [selectedUnits.size, units]);

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Price Management
          </h1>
          <p className="mt-1 text-sm text-stone">
            {units.length} {project.unit_label.toLowerCase()}s &middot; {project.currency_code}
          </p>
        </div>
        {selectedUnits.size > 0 && (
          <button
            onClick={() => setShowBulkEditor(true)}
            className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-warm-white transition-colors hover:bg-charcoal-mid"
          >
            Bulk Update ({selectedUnits.size})
          </button>
        )}
      </div>

      {/* Unit Price Table */}
      <UnitPriceTable
        units={units}
        selectedUnits={selectedUnits}
        onToggleSelect={toggleSelect}
        onSelectAll={selectAll}
        onEditPrice={setEditingUnit}
        onViewHistory={setHistoryUnit}
        currencySymbol={project.currency_symbol}
        unitLabelShort={project.unit_label_short}
      />

      {/* Price Edit Dialog */}
      {editingUnit !== null && (
        <PriceEditDialog
          unitNumber={editingUnit}
          currentPrice={units.find((u) => u.unit_number === editingUnit)?.current_price ?? null}
          projectSlug={projectSlug}
          currencySymbol={project.currency_symbol}
          unitLabelShort={project.unit_label_short}
          onClose={() => setEditingUnit(null)}
          onSaved={handlePriceUpdated}
        />
      )}

      {/* Bulk Price Editor */}
      {showBulkEditor && (
        <BulkPriceEditor
          selectedUnits={selectedUnits}
          projectSlug={projectSlug}
          currencySymbol={project.currency_symbol}
          onClose={() => setShowBulkEditor(false)}
          onSaved={handleBulkUpdated}
        />
      )}

      {/* Price History Panel */}
      {historyUnit !== null && (
        <PriceHistoryPanel
          unitNumber={historyUnit}
          projectSlug={projectSlug}
          currencySymbol={project.currency_symbol}
          unitLabelShort={project.unit_label_short}
          onClose={() => setHistoryUnit(null)}
        />
      )}
    </div>
  );
}
