"use client";

import Image from "next/image";
import { useAppDispatch } from "@/providers/AppStateProvider";
import { useEffect } from "react";

export function ImageLightbox({ src }: { src: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "SET_MODAL", payload: null });
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
    >
      <button
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20"
        onClick={() => dispatch({ type: "SET_MODAL", payload: null })}
      >
        &times;
      </button>
      <Image
        src={src}
        alt="Floor plan"
        width={1729}
        height={1207}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
