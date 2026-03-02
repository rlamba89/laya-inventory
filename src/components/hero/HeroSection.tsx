"use client";

import { LiveStats } from "./LiveStats";
import { InteractiveSiteplan } from "./InteractiveSiteplan";

export function HeroSection() {
  return (
    <section className="hero-section no-print relative overflow-hidden bg-charcoal">
      <div className="grain-overlay relative">
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col gap-6 px-8 py-10">
          {/* Header row */}
          <div className="flex items-start justify-between">
            {/* Brand heading */}
            <div>
              <h1 className="font-serif text-4xl font-semibold text-warm-white">
                LAYA <em className="font-normal text-sand">Residences</em>
              </h1>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-stone">
                Mediterranean-Inspired Luxury &middot; Taigum, Brisbane
              </p>
              <p className="mt-0.5 text-[10px] tracking-wider text-stone/60">
                Designed by MAS Architects &middot; 88 Luxury Townhouses &middot; 3 Stages
              </p>
            </div>

            <LiveStats />
          </div>

          {/* Interactive Siteplan */}
          <div className="mx-auto w-full max-w-5xl">
            <InteractiveSiteplan />
          </div>
        </div>
      </div>
    </section>
  );
}
