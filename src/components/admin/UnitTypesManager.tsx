"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { MediaUploader } from "./MediaUploader";

interface UnitTypeData {
  id: string;
  code: string;
  name: string | null;
  beds: number | null;
  baths: number | null;
  cars: number | null;
  description: string | null;
  sort_order: number;
  render_url: string | null;
  floorplan_url: string | null;
}

interface UnitTypesManagerProps {
  projectSlug: string;
  initialUnitTypes: UnitTypeData[];
}

interface FormState {
  code: string;
  name: string;
  beds: string;
  baths: string;
  cars: string;
  description: string;
}

const emptyForm: FormState = { code: "", name: "", beds: "", baths: "", cars: "", description: "" };

export function UnitTypesManager({ projectSlug, initialUnitTypes }: UnitTypesManagerProps) {
  const [unitTypes, setUnitTypes] = useState(initialUnitTypes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingFor, setUploadingFor] = useState<{ id: string; type: "render" | "floorplan" } | null>(null);

  const refreshTypes = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectSlug}/unit-types`);
    if (res.ok) {
      const data = await res.json();
      setUnitTypes(data.unitTypes);
    }
  }, [projectSlug]);

  async function handleCreate() {
    if (!form.code.trim()) {
      setError("Code is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectSlug}/unit-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim(),
          name: form.name.trim() || null,
          beds: form.beds ? parseInt(form.beds) : null,
          baths: form.baths ? parseFloat(form.baths) : null,
          cars: form.cars ? parseInt(form.cars) : null,
          description: form.description.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }
      await refreshTypes();
      setForm(emptyForm);
      setShowCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!form.code.trim()) {
      setError("Code is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectSlug}/unit-types?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim(),
          name: form.name.trim() || null,
          beds: form.beds ? parseInt(form.beds) : null,
          baths: form.baths ? parseFloat(form.baths) : null,
          cars: form.cars ? parseInt(form.cars) : null,
          description: form.description.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      await refreshTypes();
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete unit type "${code}"? This cannot be undone.`)) return;
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectSlug}/unit-types?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      await refreshTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function startEdit(ut: UnitTypeData) {
    setEditingId(ut.id);
    setShowCreate(false);
    setForm({
      code: ut.code,
      name: ut.name ?? "",
      beds: ut.beds?.toString() ?? "",
      baths: ut.baths?.toString() ?? "",
      cars: ut.cars?.toString() ?? "",
      description: ut.description ?? "",
    });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setShowCreate(false);
    setForm(emptyForm);
    setError("");
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Unit Types
          </h1>
          <p className="mt-1 text-sm text-stone">
            Define types (e.g., TH-A, TH-B) with renders and floorplans. Assign to units on the Units page.
          </p>
        </div>
        {!showCreate && !editingId && (
          <button
            onClick={() => {
              setShowCreate(true);
              setForm(emptyForm);
              setError("");
            }}
            className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:bg-charcoal-mid transition-colors"
          >
            + Add Type
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="mb-6 rounded-xl border-2 border-gold/30 bg-gold/5 p-5">
          <h3 className="mb-4 font-serif text-lg font-semibold text-charcoal">New Unit Type</h3>
          <TypeForm
            form={form}
            setForm={setForm}
            onSubmit={handleCreate}
            onCancel={cancelEdit}
            saving={saving}
            submitLabel="Create"
          />
        </div>
      )}

      {/* Unit Type Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {unitTypes.map((ut) => {
          const isEditing = editingId === ut.id;

          if (isEditing) {
            return (
              <div key={ut.id} className="rounded-xl border-2 border-gold/30 bg-gold/5 p-5">
                <h3 className="mb-4 font-serif text-lg font-semibold text-charcoal">
                  Edit: {ut.code}
                </h3>
                <TypeForm
                  form={form}
                  setForm={setForm}
                  onSubmit={() => handleUpdate(ut.id)}
                  onCancel={cancelEdit}
                  saving={saving}
                  submitLabel="Save"
                />
              </div>
            );
          }

          return (
            <div
              key={ut.id}
              className="rounded-xl border border-sand bg-white p-5 transition-shadow hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-charcoal">{ut.code}</h3>
                  {ut.name && (
                    <p className="text-sm text-stone">{ut.name}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(ut)}
                    className="rounded-md px-2 py-1 text-[10px] font-medium text-stone hover:bg-sand hover:text-charcoal transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ut.id, ut.code)}
                    className="rounded-md px-2 py-1 text-[10px] font-medium text-stone hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Specs */}
              <div className="mb-4 flex gap-3 text-xs text-charcoal-mid">
                {ut.beds != null && <span>{ut.beds} bed</span>}
                {ut.baths != null && <span>{ut.baths} bath</span>}
                {ut.cars != null && <span>{ut.cars} car</span>}
                {ut.beds == null && ut.baths == null && ut.cars == null && (
                  <span className="text-stone/60">No specs set</span>
                )}
              </div>

              {ut.description && (
                <p className="mb-4 text-xs text-stone">{ut.description}</p>
              )}

              {/* Render image */}
              <div className="mb-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone">
                  Render
                </p>
                {ut.render_url ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg bg-sand-light">
                    <Image
                      src={ut.render_url}
                      alt={`${ut.code} render`}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                    <button
                      onClick={() => setUploadingFor({ id: ut.id, type: "render" })}
                      className="absolute bottom-1 right-1 rounded bg-charcoal/70 px-2 py-0.5 text-[9px] text-white hover:bg-charcoal"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setUploadingFor({ id: ut.id, type: "render" })}
                    className="flex h-20 w-full items-center justify-center rounded-lg border-2 border-dashed border-sand text-xs text-stone hover:border-gold/50 hover:text-charcoal transition-colors"
                  >
                    + Upload Render
                  </button>
                )}
              </div>

              {/* Floorplan image */}
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone">
                  Floorplan
                </p>
                {ut.floorplan_url ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg bg-sand-light">
                    <Image
                      src={ut.floorplan_url}
                      alt={`${ut.code} floorplan`}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                    <button
                      onClick={() => setUploadingFor({ id: ut.id, type: "floorplan" })}
                      className="absolute bottom-1 right-1 rounded bg-charcoal/70 px-2 py-0.5 text-[9px] text-white hover:bg-charcoal"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setUploadingFor({ id: ut.id, type: "floorplan" })}
                    className="flex h-20 w-full items-center justify-center rounded-lg border-2 border-dashed border-sand text-xs text-stone hover:border-gold/50 hover:text-charcoal transition-colors"
                  >
                    + Upload Floorplan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {unitTypes.length === 0 && !showCreate && (
        <div className="rounded-xl border border-sand bg-sand-light/50 p-12 text-center">
          <p className="text-sm text-stone">No unit types defined yet.</p>
          <p className="mt-1 text-[11px] text-stone/60">
            Create types first, then assign them to units on the Units page.
          </p>
        </div>
      )}

      {/* Upload modal */}
      {uploadingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Upload {uploadingFor.type === "render" ? "Render" : "Floorplan"}
              </h3>
              <button
                onClick={() => setUploadingFor(null)}
                className="text-stone hover:text-charcoal"
              >
                &times;
              </button>
            </div>
            <MediaUploader
              projectSlug={projectSlug}
              mediaType={uploadingFor.type === "render" ? "render" : "floorplan"}
              unitTypeId={uploadingFor.id}
              onUploaded={() => {
                setUploadingFor(null);
                refreshTypes();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TypeForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  saving,
  submitLabel,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone mb-1">
            Code *
          </label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="TH-A"
            className="w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone mb-1">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Type A - Standard"
            className="w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone mb-1">
            Beds
          </label>
          <input
            type="number"
            value={form.beds}
            onChange={(e) => setForm({ ...form, beds: e.target.value })}
            placeholder="3"
            min="0"
            className="w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone mb-1">
            Baths
          </label>
          <input
            type="number"
            value={form.baths}
            onChange={(e) => setForm({ ...form, baths: e.target.value })}
            placeholder="2"
            min="0"
            step="0.5"
            className="w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone mb-1">
            Cars
          </label>
          <input
            type="number"
            value={form.cars}
            onChange={(e) => setForm({ ...form, cars: e.target.value })}
            placeholder="1"
            min="0"
            className="w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone mb-1">
          Description
        </label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Optional description"
          className="w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onSubmit}
          disabled={saving}
          className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:bg-charcoal-mid transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm text-stone hover:text-charcoal transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
