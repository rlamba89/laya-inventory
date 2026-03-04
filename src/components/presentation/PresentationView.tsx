"use client";

import { useState, useEffect, useCallback } from "react";
import { Townhouse } from "@/lib/types";
import { useProject } from "@/providers/ProjectProvider";
import { WelcomeSlide } from "./slides/WelcomeSlide";
import { SiteplanSlide } from "./slides/SiteplanSlide";
import { StageSpotlightSlide } from "./slides/StageSpotlightSlide";
import { StatsSlide } from "./slides/StatsSlide";
import { CtaSlide } from "./slides/CtaSlide";
import { PresentationControls } from "./PresentationControls";

interface PresentationViewProps {
  townhouses: Townhouse[];
}

interface Slide {
  id: string;
  label: string;
  component: React.ReactNode;
}

export function PresentationView({ townhouses }: PresentationViewProps) {
  const { project, stages, getStageInfo } = useProject();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  // Build slide list
  const slides: Slide[] = [];

  // 1. Welcome
  slides.push({
    id: "welcome",
    label: "Welcome",
    component: <WelcomeSlide />,
  });

  // 2. Siteplan
  if (project.siteplan_image_url) {
    slides.push({
      id: "siteplan",
      label: "Siteplan",
      component: <SiteplanSlide townhouses={townhouses} />,
    });
  }

  // 3. Stage spotlights
  const stageNumbers = stages.length > 0
    ? stages.map((s) => parseInt(s.name.replace(/\D/g, ""))).filter((n) => !isNaN(n))
    : [1, 2, 3];

  for (const num of stageNumbers) {
    const info = getStageInfo(num);
    if (info.release_status === "unreleased") continue;
    const stageTownhouses = townhouses.filter((t) => t.stg === num);
    slides.push({
      id: `stage-${num}`,
      label: `Stage ${num}`,
      component: (
        <StageSpotlightSlide
          stageNumber={num}
          townhouses={stageTownhouses}
          releaseStatus={info.release_status}
        />
      ),
    });
  }

  // 4. Stats
  slides.push({
    id: "stats",
    label: "Summary",
    component: <StatsSlide townhouses={townhouses} />,
  });

  // 5. CTA
  slides.push({
    id: "cta",
    label: "Contact",
    component: <CtaSlide />,
  });

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        window.history.back();
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Autoplay
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => {
        if (i >= slides.length - 1) {
          setIsAutoplay(false);
          return i;
        }
        return i + 1;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoplay, slides.length]);

  // BroadcastChannel for remote control sync
  useEffect(() => {
    const channel = new BroadcastChannel("laya-presentation");

    channel.onmessage = (e) => {
      if (e.data.type === "goto") {
        setCurrentIndex(e.data.index);
      }
    };

    return () => channel.close();
  }, []);

  // Broadcast current slide on change
  useEffect(() => {
    try {
      const channel = new BroadcastChannel("laya-presentation");
      channel.postMessage({ type: "sync", index: currentIndex });
      channel.close();
    } catch {
      // BroadcastChannel not supported
    }
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-charcoal">
      {/* Slide area */}
      <div className="relative flex-1 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{
              opacity: i === currentIndex ? 1 : 0,
              transform: i === currentIndex
                ? "translateX(0)"
                : i < currentIndex
                  ? "translateX(-100%)"
                  : "translateX(100%)",
              pointerEvents: i === currentIndex ? "auto" : "none",
            }}
          >
            {slide.component}
          </div>
        ))}
      </div>

      {/* Controls */}
      <PresentationControls
        currentIndex={currentIndex}
        totalSlides={slides.length}
        slideLabels={slides.map((s) => s.label)}
        isAutoplay={isAutoplay}
        onPrev={goPrev}
        onNext={goNext}
        onGoTo={setCurrentIndex}
        onToggleAutoplay={() => setIsAutoplay(!isAutoplay)}
      />
    </div>
  );
}
