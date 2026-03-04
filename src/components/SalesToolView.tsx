"use client";

import { Townhouse, ViewMode } from "@/lib/types";
import { AppStateProvider, useAppState } from "@/providers/AppStateProvider";
import { ClientNavbar } from "@/components/layout/ClientNavbar";
import { InternalNavbar } from "@/components/layout/InternalNavbar";
import { InternalDashboardHeader } from "@/components/dashboard/InternalDashboardHeader";
import { HeroSection } from "@/components/hero/HeroSection";
import { InteractiveSiteplan } from "@/components/hero/InteractiveSiteplan";
import { FilterBar } from "@/components/filters/FilterBar";
import { CardGrid } from "@/components/cards/CardGrid";
import { CompareBar } from "@/components/compare/CompareBar";
import { HoverTooltip } from "@/components/hero/HoverTooltip";
import { DetailModal } from "@/components/modals/DetailModal";
import { CompareModal } from "@/components/modals/CompareModal";
import { ImageLightbox } from "@/components/modals/ImageLightbox";
import { Footer } from "@/components/layout/Footer";

interface SalesToolViewProps {
  viewMode: ViewMode;
  townhouses: Townhouse[];
}

export function SalesToolView({ viewMode, townhouses }: SalesToolViewProps) {
  return (
    <AppStateProvider viewMode={viewMode} initialTownhouses={townhouses}>
      <SalesToolContent />
    </AppStateProvider>
  );
}

function SalesToolContent() {
  const { viewMode, activeModal } = useAppState();

  return (
    <div className="min-h-screen bg-warm-white">
      {viewMode === "client" ? <ClientNavbar /> : <InternalNavbar />}

      <main className="pt-[60px]">
        {viewMode === "internal" ? (
          <>
            <InternalDashboardHeader />
            <section className="bg-charcoal px-4 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto w-full max-w-5xl">
                <InteractiveSiteplan />
              </div>
            </section>
          </>
        ) : (
          <HeroSection />
        )}
        <FilterBar />
        <CardGrid />
      </main>

      <Footer />

      {/* Floating elements */}
      <CompareBar />
      <HoverTooltip />

      {/* Modals */}
      {activeModal?.type === "detail" && (
        <DetailModal thId={activeModal.thId} />
      )}
      {activeModal?.type === "compare" && <CompareModal />}
      {activeModal?.type === "lightbox" && (
        <ImageLightbox
          src={activeModal.src}
          gallery={activeModal.gallery}
          galleryIndex={activeModal.galleryIndex}
        />
      )}
    </div>
  );
}
