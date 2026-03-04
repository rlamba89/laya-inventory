// ============================================
// Core Status Types
// ============================================

export type UnitStatus = "available" | "sold" | "negotiation" | "hold" | "unreleased";
export type ReleaseStatus = "unreleased" | "coming_soon" | "now_selling" | "sold_out";
export type PriceType = "base" | "premium" | "discounted" | "display";
export type MediaType = "floorplan" | "render" | "photo" | "siteplan" | "gallery";

// ============================================
// Project
// ============================================

export interface ProjectBranding {
  logo_url?: string;
  colors?: Record<string, string>;
  fonts?: {
    heading?: string;
    body?: string;
  };
  developer_name?: string;
  developer_logo_url?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  location: string | null;
  description: string | null;
  branding: ProjectBranding;
  siteplan_image_url: string | null;
  siteplan_width: number | null;
  siteplan_height: number | null;
  unit_label: string;
  unit_label_short: string;
  currency_code: string;
  currency_symbol: string;
  is_active: boolean;
}

// ============================================
// Generic Grouping System
// ============================================

/** Defines a hierarchy level per project (e.g., "Stage", "Area", "Tower", "Floor") */
export interface GroupType {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_filterable: boolean;
}

/** An instance of a group type (e.g., "Stage 1", "Tower A", "Level 5") */
export interface Group {
  id: string;
  project_id: string;
  group_type_id: string;
  parent_id: string | null;
  name: string;
  short_name: string | null;
  sort_order: number;
  release_status: ReleaseStatus;
  visible_to_clients: boolean;
  release_date: string | null;
  metadata: Record<string, unknown>;

  // Joined data
  group_type?: GroupType;
  children?: Group[];
}

export interface UnitType {
  id: string;
  project_id: string;
  code: string;
  name: string | null;
  beds: number | null;
  baths: number | null;
  cars: number | null;
  description: string | null;
}

export interface ProjectAmenity {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  image_url: string | null;
  sort_order: number;
}

// ============================================
// Unit (replaces Townhouse)
// ============================================

export interface Unit {
  id: string;
  project_id: string;
  unit_number: number;
  unit_type_id: string | null;
  label: string;
  beds: number;
  baths: number;
  cars: number;
  ground_internal: number | null;
  ground_garage: number | null;
  upper_internal: number | null;
  upper_balcony: number | null;
  patio: number | null;
  total_area: number | null;
  front_yard: number | null;
  back_yard: number | null;
  lot_size: number | null;
  custom_fields: Record<string, unknown>;
  status: UnitStatus;
  hotspot_x: number | null;
  hotspot_y: number | null;
  notes: string | null;

  // Joined data (populated by queries)
  groups?: Group[];
  unit_type?: UnitType;
  current_price?: UnitPrice;
  media?: Media[];
}

export interface UnitPrice {
  id: string;
  unit_id: string;
  price_type: PriceType;
  price_min: number;
  price_max: number;
  display_text: string | null;
  is_current: boolean;
  effective_from: string;
  effective_to: string | null;
  changed_by: string | null;
  change_reason: string | null;
}

export interface Media {
  id: string;
  project_id: string;
  unit_id: string | null;
  unit_type_id: string | null;
  media_type: MediaType;
  variant: string | null;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

// ============================================
// Legacy Townhouse (kept for migration period)
// ============================================

/** @deprecated Use UnitStatus instead */
export type TownhouseStatus = UnitStatus;

/** @deprecated Use Unit instead */
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
  status: UnitStatus;
  hotspot_x: number | null;
  hotspot_y: number | null;
  renderUrl: string | null;
  unitTypeId: string | null;
}

// ============================================
// UI State Types
// ============================================

export type ViewMode = "client" | "internal";

export type StatusFilter = "all" | UnitStatus;
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
  | { type: "lightbox"; src: string; gallery?: string[]; galleryIndex?: number };
