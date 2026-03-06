import { Townhouse } from "./types";

export function groupByStageAndArea(townhouses: Townhouse[]) {
  const grouped: Record<number, Record<string, Townhouse[]>> = {};

  for (const th of townhouses) {
    if (!grouped[th.stg]) grouped[th.stg] = {};
    if (!grouped[th.stg][th.area]) grouped[th.stg][th.area] = [];
    grouped[th.stg][th.area].push(th);
  }

  return grouped;
}

export function computeKpis(townhouses: Townhouse[]) {
  let estGrv = 0;
  let soldValue = 0;
  let availableValue = 0;
  let negotiationValue = 0;
  let soldCount = 0;
  let threeBed = 0;
  let fourBed = 0;

  for (const th of townhouses) {
    estGrv += th.pMax;
    if (th.status === "sold") {
      soldValue += th.pMax;
      soldCount++;
    }
    if (th.status === "available") {
      availableValue += th.pMax;
    }
    if (th.status === "negotiation") {
      negotiationValue += th.pMax;
    }
    if (th.beds === 3) threeBed++;
    if (th.beds === 4) fourBed++;
  }

  return {
    estGrv,
    soldValue,
    availableValue,
    negotiationValue,
    soldRate: townhouses.length > 0 ? (soldCount / townhouses.length) * 100 : 0,
    soldCount,
    threeBed,
    fourBed,
    total: townhouses.length,
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    const formatted = m % 1 === 0 ? m.toFixed(0) : parseFloat(m.toFixed(3)).toString();
    return `$${formatted}M`;
  }
  return `$${value.toLocaleString()}`;
}

export function countByStatus(townhouses: Townhouse[]) {
  const counts = { available: 0, sold: 0, negotiation: 0, hold: 0, unreleased: 0 };
  for (const th of townhouses) {
    counts[th.status]++;
  }
  return counts;
}

export function exportCSV(townhouses: Townhouse[], projectName = "Export") {
  const headers = [
    "Unit", "Stage", "Area", "Description", "Type", "Beds", "Baths", "Cars",
    "Total m²", "Lot m²", "Ground Internal", "Upper Internal", "Balcony",
    "Patio", "Front Yard", "Back Yard", "Price", "Status",
  ];

  const rows = townhouses.map((th) => [
    th.id, th.stg, th.area, th.desc, th.type, th.beds, th.baths, th.cars,
    th.tot, th.lot, th.gI, th.uI, th.uB, th.pat, th.eF, th.eB,
    th.price, th.status,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((v) => {
        const str = String(v);
        return str.includes(",") || str.includes('"')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeName = projectName.replace(/[^a-zA-Z0-9]/g, "_");
  link.download = `${safeName}_${townhouses.length}_Units.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
