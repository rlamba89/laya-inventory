export const floorplanImageMap: Record<string, string> = {
  A: "/images/floorplans/floorplan-type-a.png",
  B: "/images/floorplans/floorplan-type-b.png",
  C: "/images/floorplans/floorplan-type-c.png",
  D: "/images/floorplans/floorplan-type-d.png",
  E: "/images/floorplans/floorplan-type-e.png",
  F: "/images/floorplans/floorplan-type-f.png",
  G: "/images/floorplans/floorplan-type-g.png",
  H: "/images/floorplans/floorplan-type-h.png",
  J: "/images/floorplans/floorplan-type-j.png",
};

export function getFloorplanImage(type: string): string | null {
  return floorplanImageMap[type] ?? null;
}
