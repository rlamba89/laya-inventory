"use client";

import { useEffect, useState } from "react";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";
import { useProject } from "@/providers/ProjectProvider";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Townhouse } from "@/lib/types";

const COMPARE_ROWS: { label: string; getValue: (th: Townhouse) => string | number; numeric?: boolean; higherBetter?: boolean }[] = [
  { label: "Area", getValue: (th) => th.area },
  { label: "Stage", getValue: (th) => th.stg },
  { label: "Config", getValue: (th) => th.desc },
  { label: "Type", getValue: (th) => th.type || "—" },
  { label: "Total Area", getValue: (th) => th.tot, numeric: true, higherBetter: true },
  { label: "Lot Size", getValue: (th) => th.lot, numeric: true, higherBetter: true },
  { label: "Ground Living", getValue: (th) => th.gI, numeric: true, higherBetter: true },
  { label: "Upper Living", getValue: (th) => th.uI, numeric: true, higherBetter: true },
  { label: "Balcony", getValue: (th) => th.uB, numeric: true, higherBetter: true },
  { label: "Patio", getValue: (th) => th.pat, numeric: true, higherBetter: true },
  { label: "Front Yard", getValue: (th) => th.eF, numeric: true, higherBetter: true },
  { label: "Back Yard", getValue: (th) => th.eB, numeric: true, higherBetter: true },
  { label: "Garage", getValue: (th) => th.gG, numeric: true, higherBetter: true },
];

export function CompareModal() {
  const { compareIds, townhouses, showPricing } = useAppState();
  const dispatch = useAppDispatch();
  const { project } = useProject();
  const selected = townhouses.filter((th) => compareIds.includes(th.id));
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "SET_MODAL", payload: null });
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { ComparePDF } = await import("@/components/compare/ComparePDF");

      const blob = await pdf(
        ComparePDF({
          selected,
          projectName: project.name,
          unitLabel: project.unit_label,
          unitLabelShort: project.unit_label_short,
          showPricing,
        })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, "_")}_comparison.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  if (selected.length < 2) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-warm-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-sand-light text-charcoal-light transition-colors hover:bg-sand hover:text-charcoal"
          onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
        >
          &times;
        </button>

        <div className="p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">
              Compare {project.unit_label}s
            </h2>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-sand">
                  <th className="pb-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-stone" />
                  {selected.map((th) => (
                    <th
                      key={th.id}
                      className="pb-3 pr-4 font-serif text-xl font-semibold text-charcoal"
                    >
                      {project.unit_label_short} {th.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => {
                  const values = selected.map((th) => row.getValue(th));
                  const bestIdx = row.numeric && row.higherBetter
                    ? values.indexOf(Math.max(...(values as number[])))
                    : -1;

                  return (
                    <tr key={row.label} className="border-b border-sand/50">
                      <td className="py-2.5 pr-4 text-[11px] font-semibold uppercase tracking-wider text-stone">
                        {row.label}
                      </td>
                      {values.map((val, i) => (
                        <td
                          key={i}
                          className={`py-2.5 pr-4 text-sm ${
                            i === bestIdx
                              ? "font-bold text-terracotta"
                              : "text-charcoal"
                          }`}
                        >
                          {row.numeric ? `${val}m\u00B2` : String(val)}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Price row */}
                {showPricing && (
                  <tr className="border-b border-sand/50">
                    <td className="py-2.5 pr-4 text-[11px] font-semibold uppercase tracking-wider text-stone">
                      Price
                    </td>
                    {selected.map((th) => (
                      <td key={th.id} className="py-2.5 pr-4 text-sm font-bold text-charcoal">
                        {th.price}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Status row */}
                <tr>
                  <td className="py-2.5 pr-4 text-[11px] font-semibold uppercase tracking-wider text-stone">
                    Status
                  </td>
                  {selected.map((th) => (
                    <td key={th.id} className="py-2.5 pr-4">
                      <StatusBadge status={th.status} />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Download PDF button */}
        <div className="flex justify-end px-8 pb-6">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-xs font-semibold text-warm-white transition-all hover:bg-charcoal-mid disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
