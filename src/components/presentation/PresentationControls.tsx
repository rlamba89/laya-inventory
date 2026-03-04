"use client";

interface PresentationControlsProps {
  currentIndex: number;
  totalSlides: number;
  slideLabels: string[];
  isAutoplay: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  onToggleAutoplay: () => void;
}

export function PresentationControls({
  currentIndex,
  totalSlides,
  slideLabels,
  isAutoplay,
  onPrev,
  onNext,
  onGoTo,
  onToggleAutoplay,
}: PresentationControlsProps) {
  return (
    <div className="flex items-center justify-between bg-charcoal/95 px-6 py-3 backdrop-blur-sm border-t border-white/10">
      {/* Left: slide counter */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium text-white/50">
          {currentIndex + 1} / {totalSlides}
        </span>
        <button
          onClick={onToggleAutoplay}
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
            isAutoplay
              ? "bg-gold text-white"
              : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
          }`}
        >
          {isAutoplay ? "Auto" : "Auto"}
        </button>
      </div>

      {/* Center: dot navigation */}
      <div className="flex items-center gap-1.5">
        {slideLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className="group relative"
            title={label}
          >
            <span
              className={`block rounded-full transition-all ${
                i === currentIndex
                  ? "h-2 w-6 bg-gold"
                  : "h-2 w-2 bg-white/25 hover:bg-white/50"
              }`}
            />
            {/* Label on hover */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Right: nav arrows + exit */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          &lsaquo;
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === totalSlides - 1}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          &rsaquo;
        </button>
        <button
          onClick={() => window.history.back()}
          className="ml-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
