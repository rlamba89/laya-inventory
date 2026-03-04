"use client";

import { useMemo } from "react";

export function CountdownTimer({ releaseDate }: { releaseDate: string }) {
  const daysLeft = useMemo(() => {
    const target = new Date(releaseDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [releaseDate]);

  if (daysLeft === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600">
      <span className="font-bold">{daysLeft}</span>
      day{daysLeft !== 1 ? "s" : ""} until release
    </span>
  );
}
