"use client";

import { Townhouse, ViewMode } from "@/lib/types";
import { AppStateProvider, useAppState } from "@/providers/AppStateProvider";
import { Navbar } from "@/components/layout/Navbar";
import { KpiBanner } from "@/components/kpi/KpiBanner";
import { HeroSection } from "@/components/hero/HeroSection";
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
      <Navbar />
      <KpiBanner />

      {/* Main content with top padding for fixed nav (and KPI banner on internal) */}
      <main
        className={viewMode === "internal" ? "pt-[100px]" : "pt-[60px]"}
      >
        <HeroSection />
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
        <ImageLightbox src={activeModal.src} />
      )}
    </div>
  );
}
