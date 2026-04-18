"use client";

import { useEffect, useMemo, useState } from "react";
import { Agent } from "@/lib/types";
import { AdminUnit } from "@/lib/data";

interface AgentsManagerProps {
  projectSlug: string;
  unitLabelShort: string;
  units: AdminUnit[];
}

export function AgentsManager({ projectSlug, unitLabelShort, units }: AgentsManagerProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Create form
  const [newName, setNewName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents?withCounts=true");
      const data = await res.json();
      setAgents(data.agents ?? []);
    } catch {
      setError("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), notes: newNotes.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create agent");
      }
      setNewName("");
      setNewNotes("");
      await loadAgents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const agent = agents.find((a) => a.id === id);
    const count = agent?.assigned_count ?? 0;
    if (
      !confirm(
        count > 0
          ? `Delete agent "${agent?.name}"? ${count} unit(s) will be unassigned.`
          : `Delete agent "${agent?.name}"?`
      )
    )
      return;
    const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (selectedId === id) setSelectedId(null);
      await loadAgents();
    }
  }

  const selected = agents.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-[360px_1fr] gap-6">
      {/* Left: list + create */}
      <div className="space-y-4">
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-sand bg-white p-4 space-y-2"
        >
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-stone">
            New agent
          </h2>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Agent or company name"
            className={inputClass}
          />
          <input
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="Notes (optional)"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="w-full rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-warm-white hover:bg-charcoal-mid transition-colors disabled:opacity-50"
          >
            {creating ? "Adding…" : "Add agent"}
          </button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </form>

        <div className="rounded-xl border border-sand bg-white overflow-hidden">
          <div className="border-b border-sand px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone">
            Agents ({agents.length})
          </div>
          {loading ? (
            <div className="p-4 text-xs text-stone">Loading…</div>
          ) : agents.length === 0 ? (
            <div className="p-4 text-xs text-stone">No agents yet.</div>
          ) : (
            <ul className="divide-y divide-sand">
              {agents.map((a) => (
                <li
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`cursor-pointer px-4 py-3 transition-colors ${
                    selectedId === a.id ? "bg-sand-light" : "hover:bg-sand-light"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">{a.name}</p>
                      {a.notes && (
                        <p className="truncate text-[10px] text-stone">{a.notes}</p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {a.assigned_count ?? 0}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right: detail */}
      <div className="rounded-xl border border-sand bg-white p-5 min-h-[400px]">
        {!selected ? (
          <div className="flex h-full items-center justify-center text-sm text-stone">
            Select an agent to manage assignments.
          </div>
        ) : (
          <AgentDetail
            key={selected.id}
            agent={selected}
            units={units}
            projectSlug={projectSlug}
            unitLabelShort={unitLabelShort}
            onDelete={() => handleDelete(selected.id)}
            onChanged={loadAgents}
          />
        )}
      </div>
    </div>
  );
}

function AgentDetail({
  agent,
  units,
  projectSlug,
  unitLabelShort,
  onDelete,
  onChanged,
}: {
  agent: Agent;
  units: AdminUnit[];
  projectSlug: string;
  unitLabelShort: string;
  onDelete: () => void;
  onChanged: () => void;
}) {
  const [picking, setPicking] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // Keep the units prop as the source of truth. Clicking refreshAgents after mutation will
  // not refresh units (server-rendered) — we reload the page after assignment for simplicity.
  const assignedHere = useMemo(
    () => units.filter((u) => u.agent_id === agent.id),
    [units, agent.id]
  );
  const unassignedHere = useMemo(
    () => units.filter((u) => !u.agent_id),
    [units]
  );

  const filteredUnassigned = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return unassignedHere;
    return unassignedHere.filter(
      (u) =>
        String(u.unit_number).includes(q) ||
        u.label.toLowerCase().includes(q) ||
        (u.unit_type_code ?? "").toLowerCase().includes(q)
    );
  }, [unassignedHere, search]);

  function toggle(n: number) {
    const next = new Set(selectedNumbers);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    setSelectedNumbers(next);
  }

  async function handleAssign() {
    if (selectedNumbers.size === 0) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/projects/${projectSlug}/agents/${agent.id}/assignments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitNumbers: Array.from(selectedNumbers) }),
        }
      );
      if (!res.ok) throw new Error("Failed to assign");
      setSelectedNumbers(new Set());
      setPicking(false);
      onChanged();
      // Server-rendered unit list is stale — reload to refresh.
      if (typeof window !== "undefined") window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  async function handleUnassign(n: number) {
    if (!confirm(`Unassign ${unitLabelShort} ${n} from ${agent.name}?`)) return;
    const res = await fetch(
      `/api/projects/${projectSlug}/agents/${agent.id}/assignments`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitNumbers: [n] }),
      }
    );
    if (res.ok) {
      onChanged();
      if (typeof window !== "undefined") window.location.reload();
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-4 border-b border-sand pb-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-charcoal">{agent.name}</h2>
          {agent.notes && <p className="mt-1 text-xs text-stone">{agent.notes}</p>}
          <p className="mt-2 text-[11px] text-stone">
            {assignedHere.length} unit(s) assigned in this project
          </p>
        </div>
        <button
          onClick={onDelete}
          className="rounded-lg px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
        >
          Delete agent
        </button>
      </header>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-stone">
            Assigned units
          </h3>
          {!picking ? (
            <button
              onClick={() => setPicking(true)}
              className="rounded-lg bg-charcoal px-3 py-1.5 text-xs font-medium text-warm-white hover:bg-charcoal-mid transition-colors"
            >
              + Assign units
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPicking(false);
                  setSelectedNumbers(new Set());
                }}
                className="rounded-lg px-3 py-1.5 text-xs text-stone hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={saving || selectedNumbers.size === 0}
                className="rounded-lg bg-charcoal px-3 py-1.5 text-xs font-medium text-warm-white hover:bg-charcoal-mid transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : `Assign ${selectedNumbers.size}`}
              </button>
            </div>
          )}
        </div>

        {assignedHere.length === 0 ? (
          <p className="rounded-lg bg-sand-light px-3 py-2 text-xs text-stone">
            No units assigned yet in this project.
          </p>
        ) : (
          <ul className="divide-y divide-sand rounded-lg border border-sand">
            {assignedHere.map((u) => (
              <li key={u.unit_number} className="flex items-center justify-between px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {unitLabelShort} {u.unit_number}
                    <span className="ml-2 text-[11px] text-stone">{u.label}</span>
                  </p>
                  <p className="text-[10px] text-stone">
                    {u.status}
                    {u.stage ? ` · ${u.stage}` : ""}
                    {u.area ? ` · ${u.area}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleUnassign(u.unit_number)}
                  className="text-[11px] text-red-600 hover:underline"
                >
                  Unassign
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {picking && (
        <section>
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone">
            Pick units to assign
          </h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by unit number, label, or type…"
            className={`${inputClass} mb-2`}
          />
          <div className="max-h-80 overflow-y-auto rounded-lg border border-sand">
            {filteredUnassigned.length === 0 ? (
              <p className="px-3 py-4 text-xs text-stone">No unassigned units match.</p>
            ) : (
              <ul className="divide-y divide-sand">
                {filteredUnassigned.map((u) => (
                  <li key={u.unit_number}>
                    <label className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-sand-light">
                      <input
                        type="checkbox"
                        checked={selectedNumbers.has(u.unit_number)}
                        onChange={() => toggle(u.unit_number)}
                      />
                      <span className="text-sm text-charcoal">
                        {unitLabelShort} {u.unit_number}
                      </span>
                      <span className="text-[11px] text-stone">
                        {u.label} · {u.status}
                        {u.unit_type_code ? ` · ${u.unit_type_code}` : ""}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-sand px-3 py-1.5 text-sm text-charcoal placeholder:text-stone/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
