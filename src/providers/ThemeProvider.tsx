"use client";

import { ReactNode } from "react";
import { ProjectBranding } from "@/lib/types";

export function ThemeProvider({
  children,
  branding,
}: {
  children: ReactNode;
  branding: ProjectBranding;
}) {
  // Convert branding colors to CSS custom property overrides
  const style: Record<string, string> = {};
  if (branding.colors) {
    for (const [name, value] of Object.entries(branding.colors)) {
      style[`--${name}`] = value;
    }
  }

  return (
    <div style={style} className="contents">
      {children}
    </div>
  );
}
