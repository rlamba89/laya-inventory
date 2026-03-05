"use client";

import { useState } from "react";
import { Project, ProjectBranding } from "@/lib/types";

interface SettingsEditorProps {
  project: Project;
  projectSlug: string;
}

export function SettingsEditor({ project, projectSlug }: SettingsEditorProps) {
  const [name, setName] = useState(project.name);
  const [tagline, setTagline] = useState(project.tagline ?? "");
  const [location, setLocation] = useState(project.location ?? "");
  const [description, setDescription] = useState(project.description ?? "");
  const [unitLabel, setUnitLabel] = useState(project.unit_label);
  const [unitLabelShort, setUnitLabelShort] = useState(project.unit_label_short);
  const [currencySymbol, setCurrencySymbol] = useState(project.currency_symbol);
  const [currencyCode, setCurrencyCode] = useState(project.currency_code);
  const [developerName, setDeveloperName] = useState(project.branding.developer_name ?? "");
  const [colors, setColors] = useState<Record<string, string>>(project.branding.colors ?? {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateColor(key: string, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const branding: ProjectBranding = {
      ...project.branding,
      developer_name: developerName || undefined,
      colors,
    };

    try {
      const res = await fetch(`/api/projects/${projectSlug}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline: tagline || null,
          location: location || null,
          description: description || null,
          unit_label: unitLabel,
          unit_label_short: unitLabelShort,
          currency_symbol: currencySymbol,
          currency_code: currencyCode,
          branding,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const colorKeys = [
    { key: "charcoal", label: "Charcoal (primary dark)" },
    { key: "warm-white", label: "Warm White (background)" },
    { key: "terracotta", label: "Terracotta (accent)" },
    { key: "gold", label: "Gold (highlight)" },
    { key: "olive", label: "Olive (available)" },
    { key: "navy", label: "Navy (info)" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Settings</h1>
        <p className="mt-1 text-sm text-stone">
          Project branding, labels, and configuration
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* General Info */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal">
            General
          </h2>
          <div className="space-y-4">
            <Field label="Project Name" value={name} onChange={setName} />
            <Field label="Tagline" value={tagline} onChange={setTagline} placeholder="e.g., Mediterranean-Inspired Luxury" />
            <Field label="Location" value={location} onChange={setLocation} placeholder="e.g., Taigum, Brisbane" />
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal-mid">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal placeholder:text-stone/50 focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Labels & Currency */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal">
            Labels & Currency
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Unit Label" value={unitLabel} onChange={setUnitLabel} placeholder="Terrace Home" />
            <Field label="Unit Label Short" value={unitLabelShort} onChange={setUnitLabelShort} placeholder="TH" />
            <Field label="Currency Symbol" value={currencySymbol} onChange={setCurrencySymbol} placeholder="$" />
            <Field label="Currency Code" value={currencyCode} onChange={setCurrencyCode} placeholder="AUD" />
          </div>
        </section>

        {/* Branding */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal">
            Branding
          </h2>
          <div className="space-y-4">
            <Field label="Developer Name" value={developerName} onChange={setDeveloperName} placeholder="e.g., TRK Property Group" />

            <div>
              <label className="mb-2 block text-xs font-medium text-charcoal-mid">Theme Colors</label>
              <div className="grid grid-cols-2 gap-3">
                {colorKeys.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors[key] ?? "#000000"}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-sand"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-charcoal">{label}</p>
                      <p className="font-mono text-[10px] text-stone">{colors[key] ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal">
            Preview
          </h2>
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: colors["charcoal"] ?? "#1E1E1E" }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: colors["gold"] ?? "#B8975A" }}
            >
              {developerName || "Developer"}
            </p>
            <h3
              className="mt-2 font-serif text-2xl font-semibold"
              style={{ color: colors["warm-white"] ?? "#FFFDF8" }}
            >
              {name}
            </h3>
            <p
              className="mt-1 text-sm"
              style={{ color: colors["warm-white"] ?? "#FFFDF8", opacity: 0.6 }}
            >
              {tagline || "Your tagline here"}
            </p>
            <div className="mt-4 flex gap-2">
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: colors["olive"] ?? "#6B7F5E" }}
              >
                Available
              </span>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: colors["terracotta"] ?? "#C2694A" }}
              >
                {unitLabel}
              </span>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-3 border-t border-sand pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-terracotta px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-terracotta/80 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-available">Settings saved</span>
          )}
          {error && (
            <span className="text-sm font-medium text-sold">{error}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-charcoal-mid">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-sand px-3 py-2 text-sm text-charcoal placeholder:text-stone/50 focus:border-terracotta focus:outline-none"
      />
    </div>
  );
}
