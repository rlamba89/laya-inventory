-- ============================================
-- LAYA Inventory Platform — Initial Schema
-- Generic grouping system for any project type
-- ============================================

-- Projects
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  tagline         TEXT,
  location        TEXT,
  description     TEXT,
  branding        JSONB NOT NULL DEFAULT '{}',
  siteplan_image_url  TEXT,
  siteplan_width      INT,
  siteplan_height     INT,
  unit_label          TEXT NOT NULL DEFAULT 'Terrace Home',
  unit_label_short    TEXT NOT NULL DEFAULT 'TH',
  currency_code       TEXT NOT NULL DEFAULT 'AUD',
  currency_symbol     TEXT NOT NULL DEFAULT '$',
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Generic Grouping System
-- ============================================

-- Group types define hierarchy levels per project
-- Terrace Homes: "Stage" (order 1), "Area" (order 2)
-- High-rise:  "Tower" (order 1), "Floor" (order 2), "Wing" (order 3)
-- Villas:     "Phase" (order 1), "Street" (order 2)
CREATE TABLE group_types (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  display_order   INT NOT NULL,
  is_filterable   BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, slug)
);

-- Groups are instances of group types
-- e.g., Stage 1, Streetside, Tower A, Level 5
CREATE TABLE groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  group_type_id   UUID NOT NULL REFERENCES group_types(id) ON DELETE CASCADE,
  parent_id       UUID REFERENCES groups(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  short_name      TEXT,
  sort_order      INT NOT NULL DEFAULT 0,
  release_status  TEXT NOT NULL DEFAULT 'now_selling'
    CHECK (release_status IN ('unreleased', 'coming_soon', 'now_selling', 'sold_out')),
  visible_to_clients BOOLEAN DEFAULT true,
  release_date    DATE,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, group_type_id, name)
);

-- ============================================
-- Unit types (floor plan types)
-- ============================================
CREATE TABLE unit_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code        TEXT NOT NULL,
  name        TEXT,
  beds        INT,
  baths       NUMERIC(3,1),
  cars        INT,
  description TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, code)
);

-- ============================================
-- Units (the core inventory)
-- ============================================
CREATE TABLE units (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  unit_number     INT NOT NULL,
  unit_type_id    UUID REFERENCES unit_types(id),
  label           TEXT NOT NULL,
  beds            INT NOT NULL,
  baths           NUMERIC(3,1) NOT NULL,
  cars            INT NOT NULL DEFAULT 0,
  -- Area measurements (all nullable — different project types use different fields)
  ground_internal NUMERIC(8,2),
  ground_garage   NUMERIC(8,2),
  upper_internal  NUMERIC(8,2),
  upper_balcony   NUMERIC(8,2),
  patio           NUMERIC(8,2),
  total_area      NUMERIC(8,2),
  front_yard      NUMERIC(8,2),
  back_yard       NUMERIC(8,2),
  lot_size        NUMERIC(8,2),
  -- Flexible extra measurements (for project-specific fields)
  custom_fields   JSONB DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'sold', 'negotiation', 'hold', 'unreleased')),
  hotspot_x       NUMERIC(6,2),
  hotspot_y       NUMERIC(6,2),
  notes           TEXT,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, unit_number)
);

-- Unit-to-group assignments (many-to-many)
-- A unit typically belongs to one group per group_type
CREATE TABLE unit_groups (
  unit_id   UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  group_id  UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (unit_id, group_id)
);

-- ============================================
-- Pricing
-- ============================================
CREATE TABLE unit_prices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id         UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  price_type      TEXT NOT NULL DEFAULT 'base'
    CHECK (price_type IN ('base', 'premium', 'discounted', 'display')),
  price_min       BIGINT NOT NULL,
  price_max       BIGINT NOT NULL,
  display_text    TEXT,
  is_current      BOOLEAN DEFAULT true,
  effective_from  TIMESTAMPTZ DEFAULT now(),
  effective_to    TIMESTAMPTZ,
  changed_by      TEXT,
  change_reason   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_unit_prices_current ON unit_prices(unit_id, is_current) WHERE is_current = true;

-- Price visibility settings per project per view
CREATE TABLE price_visibility (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  view_mode       TEXT NOT NULL CHECK (view_mode IN ('client', 'internal')),
  show_prices     BOOLEAN DEFAULT false,
  show_price_range BOOLEAN DEFAULT true,
  price_type_shown TEXT DEFAULT 'display',
  UNIQUE(project_id, view_mode)
);

-- ============================================
-- Media
-- ============================================
CREATE TABLE media (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  unit_id         UUID REFERENCES units(id) ON DELETE SET NULL,
  unit_type_id    UUID REFERENCES unit_types(id) ON DELETE SET NULL,
  media_type      TEXT NOT NULL
    CHECK (media_type IN ('floorplan', 'render', 'photo', 'siteplan', 'gallery')),
  variant         TEXT,
  url             TEXT NOT NULL,
  alt_text        TEXT,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Project amenities (showcase only)
-- ============================================
CREATE TABLE project_amenities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  category    TEXT,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Audit
-- ============================================
CREATE TABLE status_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  old_status  TEXT,
  new_status  TEXT NOT NULL,
  changed_by  TEXT,
  changed_at  TIMESTAMPTZ DEFAULT now(),
  notes       TEXT
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_unit_groups_unit ON unit_groups(unit_id);
CREATE INDEX idx_unit_groups_group ON unit_groups(group_id);
CREATE INDEX idx_groups_project ON groups(project_id);
CREATE INDEX idx_groups_type ON groups(group_type_id);
CREATE INDEX idx_group_types_project ON group_types(project_id);
CREATE INDEX idx_media_project ON media(project_id);
CREATE INDEX idx_media_unit ON media(unit_id);
CREATE INDEX idx_media_unit_type ON media(unit_type_id);
CREATE INDEX idx_audit_unit ON status_audit_log(unit_id);
CREATE INDEX idx_amenities_project ON project_amenities(project_id);

-- ============================================
-- Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
