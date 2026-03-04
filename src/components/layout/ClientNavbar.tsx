"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useAppState, useAppDispatch } from "@/providers/AppStateProvider";
import { useProject } from "@/providers/ProjectProvider";
import { exportCSV } from "@/lib/utils";

function DotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
}

export function ClientNavbar() {
  const { showPricing, townhouses } = useAppState();
  const dispatch = useAppDispatch();
  const { project } = useProject();

  return (
    <nav className="no-print fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between bg-charcoal px-3 shadow-md sm:px-6">
      {/* Brand */}
      <Link href={`/${project.slug}/client`} className="shrink-0">
        <span className="font-serif text-lg font-semibold tracking-wide text-warm-white sm:text-xl">
          {project.name}
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Price toggle */}
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

        {/* CSV Export */}
        <button
          onClick={() => exportCSV(townhouses, project.name)}
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

        {/* User menu with admin/internal links tucked inside */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-7 w-7",
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="Admin"
              labelIcon={<DotIcon />}
              href={`/${project.slug}/admin`}
            />
            <UserButton.Link
              label="Internal Dashboard"
              labelIcon={<DotIcon />}
              href={`/${project.slug}/internal`}
            />
          </UserButton.MenuItems>
        </UserButton>
      </div>
    </nav>
  );
}
