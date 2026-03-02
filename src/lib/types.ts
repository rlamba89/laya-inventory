export type TownhouseStatus = "available" | "sold" | "negotiation" | "hold";

export interface Townhouse {
  id: number;
  stg: number;
  area: string;
  desc: string;
  type: string;
  beds: number;
  baths: number;
  cars: number;
  gI: number;
  gG: number;
  uI: number;
  uB: number;
  pat: number;
  tot: number;
  eF: number;
  eB: number;
  lot: number;
  price: string;
  pMin: number;
  pMax: number;
  status: TownhouseStatus;
}

export type ViewMode = "client" | "internal";

export type StatusFilter = "all" | TownhouseStatus;
export type BedsFilter = "all" | 3 | 4;
export type StageFilter = "all" | 1 | 2 | 3;

export interface FilterState {
  status: StatusFilter;
  beds: BedsFilter;
  stage: StageFilter;
}

export interface HotspotPosition {
  id: number;
  x: number;
  y: number;
}

export type ModalState =
  | { type: "detail"; thId: number }
  | { type: "compare" }
  | { type: "lightbox"; src: string };
