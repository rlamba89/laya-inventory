"use client";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-charcoal text-warm-white shadow-sm"
          : "bg-sand-light text-charcoal-light hover:bg-sand hover:text-charcoal"
      }`}
    >
      {label}
    </button>
  );
}
