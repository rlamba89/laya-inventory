"use client";

import { LiveStats } from "./LiveStats";
import { InteractiveSiteplan } from "./InteractiveSiteplan";

export function HeroSection() {
  return (
    <section className="hero-section no-print relative overflow-hidden">
      {/* Brand header + stats */}
      <div className="bg-sand-light px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
              LAYA{" "}
              <em className="font-normal italic text-charcoal-light">
                Residences
              </em>
            </h1>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-stone sm:text-[11px] sm:tracking-[0.25em]">
              Mediterranean-Inspired Luxury &middot; Taigum, Brisbane
            </p>
            <p className="mt-0.5 text-[9px] tracking-wider text-stone/60 sm:text-[10px]">
              Designed by MAS Architects &middot; 88 Luxury Townhouses &middot; 3 Stages
            </p>
          </div>

          <LiveStats />
        </div>
      </div>

      {/* Interactive Siteplan */}
      <div className="bg-charcoal px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <InteractiveSiteplan />
        </div>
      </div>
    </section>
  );
}
