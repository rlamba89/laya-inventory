"use client";

import Image from "next/image";
import { useAppDispatch } from "@/providers/AppStateProvider";
import { useEffect, useState } from "react";

interface ImageLightboxProps {
  src: string;
  gallery?: string[];
  galleryIndex?: number;
}

export function ImageLightbox({ src, gallery, galleryIndex }: ImageLightboxProps) {
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(galleryIndex ?? 0);

  const images = gallery && gallery.length > 0 ? gallery : [src];
  const currentSrc = images[currentIndex] ?? src;
  const hasMultiple = images.length > 1;

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, images.length - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "SET_MODAL", payload: null });
      } else if (e.key === "ArrowRight" && hasMultiple) {
        goNext();
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch, hasMultiple]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
    >
      {/* Close */}
      <button
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20"
        onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
      >
        &times;
      </button>

      {/* Counter */}
      {hasMultiple && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev arrow */}
      {hasMultiple && currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
        >
          &lsaquo;
        </button>
      )}

      {/* Image */}
      <Image
        src={currentSrc}
        alt="Media"
        width={1729}
        height={1207}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next arrow */}
      {hasMultiple && currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
        >
          &rsaquo;
        </button>
      )}

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((imgSrc, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`h-12 w-16 overflow-hidden rounded-md border-2 transition-all ${
                i === currentIndex
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={imgSrc}
                alt=""
                width={64}
                height={48}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
