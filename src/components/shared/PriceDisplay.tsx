"use client";

import { useAppState } from "@/providers/AppStateProvider";

export function PriceDisplay({ price }: { price: string }) {
  const { showPricing } = useAppState();

  if (!showPricing) return null;

  return (
    <p className="font-sans text-sm font-bold text-charcoal-mid">
      {price}
    </p>
  );
}
