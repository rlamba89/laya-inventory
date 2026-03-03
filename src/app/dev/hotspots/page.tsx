"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { hotspotPositions } from "@/lib/siteplan-hotspots";

export default function HotspotsDevPage() {
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const imgRef = useRef<HTMLDivElement>(null);
  const [nextId, setNextId] = useState(1);
  const [showExisting, setShowExisting] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    const rect = imgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const entry = { id: nextId, x: +x.toFixed(1), y: +y.toFixed(1) };
    setClicks((prev) => [...prev, entry]);
    setNextId((prev) => prev + 1);
    console.log(JSON.stringify(entry));
  };

  const copyAll = () => {
    const sorted = [...clicks].sort((a, b) => a.id - b.id);
    const lines = sorted.map(
      (p) => `  { id: ${p.id}, x: ${p.x}, y: ${p.y} },`
    );
    const json = `[\n${lines.join("\n")}\n]`;
    navigator.clipboard.writeText(json);
  };

  const undoLast = () => {
    setClicks((prev) => {
      const next = prev.slice(0, -1);
      if (next.length > 0) {
        setNextId(next[next.length - 1].id + 1);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <h1 className="mb-2 text-xl font-bold">Hotspot Calibration Tool</h1>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          Next ID:
          <input
            type="number"
            value={nextId}
            onChange={(e) => setNextId(+e.target.value)}
            className="w-20 rounded bg-gray-800 px-2 py-1 text-white"
            min={1}
            max={88}
          />
        </label>
        <button
          onClick={copyAll}
          className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-500"
        >
          Copy All ({clicks.length})
        </button>
        <button
          onClick={undoLast}
          className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-500"
          disabled={clicks.length === 0}
        >
          Undo Last
        </button>
        <button
          onClick={() => setClicks([])}
          className="rounded bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
        >
          Clear All
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showExisting}
            onChange={(e) => setShowExisting(e.target.checked)}
          />
          Show existing hotspots
        </label>
      </div>

      <div
        ref={imgRef}
        className="relative cursor-crosshair"
        onClick={handleClick}
      >
        <Image
          src="/images/siteplans/site-plan.png"
          alt="calibration"
          width={1984}
          height={1083}
          className="h-auto w-full"
          priority
          draggable={false}
        />

        {/* Existing hotspots (blue) */}
        {showExisting &&
          hotspotPositions.map((p) => (
            <div
              key={`existing-${p.id}`}
              className="pointer-events-none absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500/50 text-[8px] font-bold text-white"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.id}
            </div>
          ))}

        {/* New clicks (red) */}
        {clicks.map((p, i) => (
          <div
            key={`new-${i}`}
            className="pointer-events-none absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500/80 text-[8px] font-bold text-white"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.id}
          </div>
        ))}
      </div>

      {/* Output panel */}
      {clicks.length > 0 && (
        <pre className="mt-4 max-h-60 overflow-auto rounded bg-gray-800 p-3 text-xs">
          {clicks.map((p) => `{ id: ${p.id}, x: ${p.x}, y: ${p.y} }`).join("\n")}
        </pre>
      )}
    </div>
  );
}
