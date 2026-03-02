"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";
import { exportCSV } from "@/lib/utils";

export function Navbar() {
  const { viewMode, showPricing, townhouses } = useAppState();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  return (
    <nav className="no-print fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between bg-charcoal px-3 shadow-md sm:px-6">
      {/* Brand */}
      <Link href={viewMode === "internal" ? "/internal" : "/client"} className="shrink-0">
        <span className="font-serif text-lg font-semibold tracking-wide text-warm-white sm:text-xl">
          LAYA
        </span>
      </Link>

      {/* View tabs */}
      <div className="flex items-center gap-0.5 rounded-full bg-charcoal-mid/50 p-0.5 sm:gap-1">
        <Link
          href="/client"
          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 sm:px-4 sm:text-xs ${
            pathname.startsWith("/client")
              ? "bg-terracotta text-white"
              : "text-stone hover:text-warm-white"
          }`}
        >
          Client View
        </Link>
        <Link
          href="/internal"
          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 sm:px-4 sm:text-xs ${
            pathname.startsWith("/internal")
              ? "bg-terracotta text-white"
              : "text-stone hover:text-warm-white"
          }`}
        >
          Internal
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Price toggle - client view only */}
        {viewMode === "client" && (
          <button
            onClick={() => dispatch({ type: "TOGGLE_PRICING" })}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 sm:gap-1.5 sm:px-3 sm:text-xs ${
              showPricing
                ? "bg-gold text-charcoal"
                : "bg-charcoal-mid/50 text-stone hover:text-warm-white"
            }`}
          >
            <span className="text-sm">{showPricing ? "\u25C9" : "\u25CB"}</span>
            Pricing
          </button>
        )}

        {/* CSV Export */}
        <button
          onClick={() => exportCSV(townhouses)}
          className="flex items-center gap-1 rounded-full bg-charcoal-mid/50 px-2.5 py-1.5 text-[11px] font-medium text-stone transition-colors hover:text-warm-white sm:px-3 sm:text-xs"
          title="Export CSV"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="hidden sm:inline">CSV</span>
        </button>

        {/* Print */}
        <button
          onClick={() => window.print()}
          className="flex items-center rounded-full bg-charcoal-mid/50 p-1.5 text-stone transition-colors hover:text-warm-white sm:p-2"
          title="Print"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
