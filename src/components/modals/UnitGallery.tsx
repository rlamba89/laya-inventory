"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Media } from "@/lib/types";
import { useAppDispatch } from "@/providers/AppStateProvider";

interface UnitGalleryProps {
  media: Media[];
}

export function UnitGallery({ media }: UnitGalleryProps) {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track active slide via IntersectionObserver
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.6 }
    );

    const slides = container.querySelectorAll("[data-index]");
    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [media.length]);

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const slide = container.children[index] as HTMLElement;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  if (media.length === 0) return null;

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {media.map((item, i) => (
          <div
            key={item.id}
            data-index={i}
            className="flex-none snap-center"
            style={{ width: media.length === 1 ? "100%" : "85%" }}
          >
            <div
              className="relative aspect-[16/10] cursor-zoom-in overflow-hidden rounded-xl border border-sand bg-ivory/30"
              onClick={() =>
                dispatch({
                  type: "SET_MODAL",
                  payload: {
                    type: "lightbox",
                    src: item.url,
                    gallery: media.map((m) => m.url),
                    galleryIndex: i,
                  },
                })
              }
            >
              <Image
                src={item.url}
                alt={item.alt_text || "Unit image"}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 100vw, 600px"
              />
              {/* Type pill */}
              {item.variant && (
                <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                  {item.variant}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      {media.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-4 bg-gold"
                  : "w-1.5 bg-stone/20 hover:bg-stone/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrow nav */}
      {media.length > 1 && (
        <>
          {activeIndex > 0 && (
            <button
              onClick={() => scrollTo(activeIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-sm backdrop-blur-sm hover:bg-white"
            >
              &lsaquo;
            </button>
          )}
          {activeIndex < media.length - 1 && (
            <button
              onClick={() => scrollTo(activeIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-sm backdrop-blur-sm hover:bg-white"
            >
              &rsaquo;
            </button>
          )}
        </>
      )}
    </div>
  );
}
