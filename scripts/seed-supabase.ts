/**
 * Migration script: Seed Supabase with LAYA Residences data
 * Uses the generic grouping system (group_types + groups + unit_groups)
 *
 * Usage:
 *   npx tsx scripts/seed-supabase.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SECRET_KEY
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import townhousesJson from "../src/data/townhouses.json";
import { hotspotPositions } from "../src/lib/siteplan-hotspots";
import { floorplanImageMap } from "../src/lib/floorplan-map";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

interface LegacyTownhouse {
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
  status: string;
}

const townhouses = townhousesJson as LegacyTownhouse[];

async function seed() {
  console.log("Starting LAYA Residences data migration...\n");

  // 1. Create project
  console.log("1. Creating project...");
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .insert({
      slug: "laya-residences",
      name: "LAYA Residences",
      tagline: "Mediterranean-Inspired Luxury",
      location: "Taigum, Brisbane",
      description: "88 Mediterranean-inspired luxury townhouses across 3 development stages",
      branding: {
        developer_name: "TRK Property Group",
        colors: {
          charcoal: "#1E1E1E",
          "warm-white": "#FFFDF8",
          terracotta: "#C2694A",
          gold: "#B8975A",
          olive: "#6B7F5E",
          navy: "#2B3A4E",
        },
        fonts: {
          heading: "Playfair Display",
          body: "DM Sans",
        },
      },
      siteplan_image_url: "/images/siteplans/site-plan.png",
      siteplan_width: 1984,
      siteplan_height: 1083,
      unit_label: "Townhouse",
      unit_label_short: "TH",
      currency_code: "AUD",
      currency_symbol: "$",
    })
    .select()
    .single();

  if (projectErr) throw new Error(`Project insert failed: ${projectErr.message}`);
  console.log(`   Created project: ${project.name} (${project.id})\n`);

  const projectId = project.id;

  // 2. Create group types (Stage = level 1, Area = level 2)
  console.log("2. Creating group types...");
  const { data: groupTypes, error: gtErr } = await supabase
    .from("group_types")
    .insert([
      { project_id: projectId, name: "Stage", slug: "stage", display_order: 1, is_filterable: true },
      { project_id: projectId, name: "Area", slug: "area", display_order: 2, is_filterable: true },
    ])
    .select();

  if (gtErr) throw new Error(`Group types insert failed: ${gtErr.message}`);
  const stageTypeId = groupTypes!.find((gt) => gt.slug === "stage")!.id;
  const areaTypeId = groupTypes!.find((gt) => gt.slug === "area")!.id;
  console.log(`   Created ${groupTypes!.length} group types (Stage, Area)\n`);

  // 3. Create stage groups
  console.log("3. Creating stage groups...");
  const stageConfigs = [
    { name: "Stage 1", short_name: "S1", sort_order: 0, release_status: "now_selling" },
    { name: "Stage 2", short_name: "S2", sort_order: 1, release_status: "now_selling" },
    { name: "Stage 3", short_name: "S3", sort_order: 2, release_status: "now_selling" },
  ];

  const { data: stageGroups, error: sgErr } = await supabase
    .from("groups")
    .insert(stageConfigs.map((s) => ({
      project_id: projectId,
      group_type_id: stageTypeId,
      ...s,
      visible_to_clients: true,
    })))
    .select();

  if (sgErr) throw new Error(`Stage groups insert failed: ${sgErr.message}`);
  // Map stage number (1,2,3) to group ID by matching name
  const stageMap = new Map<number, string>();
  stageGroups!.forEach((sg) => {
    const num = parseInt(sg.name.replace("Stage ", ""));
    stageMap.set(num, sg.id);
  });
  console.log(`   Created ${stageGroups!.length} stage groups\n`);

  // 4. Create area groups
  console.log("4. Creating area groups...");
  const areaNames = ["Streetside", "Shopside", "Inner Circle", "Reserve Outlook", "Eastern Side"];
  const { data: areaGroups, error: agErr } = await supabase
    .from("groups")
    .insert(areaNames.map((name, i) => ({
      project_id: projectId,
      group_type_id: areaTypeId,
      name,
      sort_order: i,
      release_status: "now_selling" as const,
      visible_to_clients: true,
    })))
    .select();

  if (agErr) throw new Error(`Area groups insert failed: ${agErr.message}`);
  const areaMap = new Map(areaGroups!.map((a) => [a.name, a.id]));
  console.log(`   Created ${areaGroups!.length} area groups\n`);

  // 5. Create unit types
  console.log("5. Creating unit types...");
  const typeSet = new Set(townhouses.map((t) => t.type).filter(Boolean));
  const typeCodes = Array.from(typeSet).sort();

  const { data: unitTypes, error: utErr } = await supabase
    .from("unit_types")
    .insert(
      typeCodes.map((code, i) => ({
        project_id: projectId,
        code,
        name: code === "Cust" ? "Custom" : `Type ${code}`,
        sort_order: i,
      }))
    )
    .select();

  if (utErr) throw new Error(`Unit types insert failed: ${utErr.message}`);
  const typeMap = new Map(unitTypes!.map((ut) => [ut.code, ut.id]));
  console.log(`   Created ${unitTypes!.length} unit types: ${typeCodes.join(", ")}\n`);

  // 6. Create hotspot lookup
  const hotspotMap = new Map(hotspotPositions.map((h) => [h.id, { x: h.x, y: h.y }]));

  // 7. Insert units (no stage_id/area_id — group assignments come via unit_groups)
  console.log("6. Inserting 88 units...");
  const unitInserts = townhouses.map((th) => {
    const hotspot = hotspotMap.get(th.id);
    return {
      project_id: projectId,
      unit_number: th.id,
      unit_type_id: th.type ? (typeMap.get(th.type) ?? null) : null,
      label: th.desc,
      beds: th.beds,
      baths: th.baths,
      cars: th.cars,
      ground_internal: th.gI,
      ground_garage: th.gG,
      upper_internal: th.uI,
      upper_balcony: th.uB,
      patio: th.pat,
      total_area: th.tot,
      front_yard: th.eF,
      back_yard: th.eB,
      lot_size: th.lot,
      status: th.status,
      hotspot_x: hotspot?.x ?? null,
      hotspot_y: hotspot?.y ?? null,
      sort_order: th.id,
    };
  });

  const { data: units, error: unitsErr } = await supabase
    .from("units")
    .insert(unitInserts)
    .select("id, unit_number");

  if (unitsErr) throw new Error(`Units insert failed: ${unitsErr.message}`);
  const unitMap = new Map(units!.map((u) => [u.unit_number, u.id]));
  console.log(`   Inserted ${units!.length} units\n`);

  // 8. Create unit-group assignments (many-to-many)
  console.log("7. Creating unit-group assignments...");
  const unitGroupRows: { unit_id: string; group_id: string }[] = [];

  for (const th of townhouses) {
    const unitId = unitMap.get(th.id);
    if (!unitId) continue;

    // Assign to stage group
    const stageGroupId = stageMap.get(th.stg);
    if (stageGroupId) {
      unitGroupRows.push({ unit_id: unitId, group_id: stageGroupId });
    }

    // Assign to area group
    const areaGroupId = areaMap.get(th.area);
    if (areaGroupId) {
      unitGroupRows.push({ unit_id: unitId, group_id: areaGroupId });
    }
  }

  // Insert in batches (Supabase has row limits)
  const BATCH_SIZE = 100;
  for (let i = 0; i < unitGroupRows.length; i += BATCH_SIZE) {
    const batch = unitGroupRows.slice(i, i + BATCH_SIZE);
    const { error: ugErr } = await supabase.from("unit_groups").insert(batch);
    if (ugErr) throw new Error(`Unit-group insert failed (batch ${i}): ${ugErr.message}`);
  }
  console.log(`   Created ${unitGroupRows.length} unit-group assignments\n`);

  // 9. Insert prices
  console.log("8. Inserting prices...");
  const priceInserts = townhouses
    .filter((th) => th.pMin > 0 || th.pMax > 0)
    .map((th) => ({
      unit_id: unitMap.get(th.id)!,
      price_type: "base" as const,
      price_min: th.pMin,
      price_max: th.pMax,
      display_text: th.price,
      is_current: true,
    }));

  const { error: pricesErr } = await supabase.from("unit_prices").insert(priceInserts);
  if (pricesErr) throw new Error(`Prices insert failed: ${pricesErr.message}`);
  console.log(`   Inserted ${priceInserts.length} price records\n`);

  // 10. Insert floor plan media
  console.log("9. Inserting floor plan media...");
  const mediaInserts: {
    project_id: string;
    unit_type_id: string;
    media_type: string;
    url: string;
    alt_text: string;
    sort_order: number;
  }[] = [];

  for (const [code, url] of Object.entries(floorplanImageMap)) {
    const utId = typeMap.get(code);
    if (utId) {
      mediaInserts.push({
        project_id: projectId,
        unit_type_id: utId,
        media_type: "floorplan",
        url,
        alt_text: `Floor plan - Type ${code}`,
        sort_order: 0,
      });
    }
  }

  if (mediaInserts.length > 0) {
    const { error: mediaErr } = await supabase.from("media").insert(mediaInserts);
    if (mediaErr) throw new Error(`Media insert failed: ${mediaErr.message}`);
  }
  console.log(`   Inserted ${mediaInserts.length} floor plan media records\n`);

  // 11. Insert price visibility defaults
  console.log("10. Setting price visibility defaults...");
  const { error: pvErr } = await supabase.from("price_visibility").insert([
    { project_id: projectId, view_mode: "client", show_prices: false, show_price_range: true, price_type_shown: "display" },
    { project_id: projectId, view_mode: "internal", show_prices: true, show_price_range: false, price_type_shown: "base" },
  ]);
  if (pvErr) throw new Error(`Price visibility insert failed: ${pvErr.message}`);
  console.log("   Done\n");

  console.log("=".repeat(50));
  console.log("Migration complete!");
  console.log(`Project ID: ${projectId}`);
  console.log(`Project slug: laya-residences`);
  console.log(`Units: ${units!.length}`);
  console.log(`Group types: ${groupTypes!.length} (Stage, Area)`);
  console.log(`Stage groups: ${stageGroups!.length}`);
  console.log(`Area groups: ${areaGroups!.length}`);
  console.log(`Unit-group assignments: ${unitGroupRows.length}`);
  console.log(`Unit types: ${unitTypes!.length}`);
  console.log(`Prices: ${priceInserts.length}`);
  console.log(`Media: ${mediaInserts.length}`);
}

seed().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
