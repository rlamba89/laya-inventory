-- Migration: Update all unit data from LAYA Residences Price List Excel
-- Generated from docs/LAYA_Residences_Price_List.xlsx
-- This updates dimensions, type assignments, prices, and group assignments for all 88 units

DO $$
DECLARE
  v_project_id UUID;
  v_unit_id UUID;
  v_type_a UUID;
  v_type_b UUID;
  v_type_d UUID;
  v_type_cust UUID;
  v_stage1 UUID;
  v_stage2 UUID;
  v_stage3 UUID;
  v_area_streetside UUID;
  v_area_shopside UUID;
  v_area_inner_circle UUID;
  v_area_reserve_outlook UUID;
  v_area_eastern_side UUID;
  v_stage_type_id UUID;
  v_area_type_id UUID;
BEGIN
  -- Look up project
  SELECT id INTO v_project_id FROM projects WHERE slug = 'laya-residences';

  -- Look up unit type IDs
  SELECT id INTO v_type_a FROM unit_types WHERE project_id = v_project_id AND code = 'A';
  SELECT id INTO v_type_b FROM unit_types WHERE project_id = v_project_id AND code = 'B';
  SELECT id INTO v_type_d FROM unit_types WHERE project_id = v_project_id AND code = 'D';
  SELECT id INTO v_type_cust FROM unit_types WHERE project_id = v_project_id AND code = 'Cust';

  -- Look up group type IDs
  SELECT id INTO v_stage_type_id FROM group_types WHERE project_id = v_project_id AND slug = 'stage';
  SELECT id INTO v_area_type_id FROM group_types WHERE project_id = v_project_id AND slug = 'area';

  -- Look up stage group IDs
  SELECT id INTO v_stage1 FROM groups WHERE project_id = v_project_id AND group_type_id = v_stage_type_id AND name = 'Stage 1';
  SELECT id INTO v_stage2 FROM groups WHERE project_id = v_project_id AND group_type_id = v_stage_type_id AND name = 'Stage 2';
  SELECT id INTO v_stage3 FROM groups WHERE project_id = v_project_id AND group_type_id = v_stage_type_id AND name = 'Stage 3';

  -- Look up area group IDs
  SELECT id INTO v_area_streetside FROM groups WHERE project_id = v_project_id AND group_type_id = v_area_type_id AND name = 'Streetside';
  SELECT id INTO v_area_shopside FROM groups WHERE project_id = v_project_id AND group_type_id = v_area_type_id AND name = 'Shopside';
  SELECT id INTO v_area_inner_circle FROM groups WHERE project_id = v_project_id AND group_type_id = v_area_type_id AND name = 'Inner Circle';
  SELECT id INTO v_area_reserve_outlook FROM groups WHERE project_id = v_project_id AND group_type_id = v_area_type_id AND name = 'Reserve Outlook';
  SELECT id INTO v_area_eastern_side FROM groups WHERE project_id = v_project_id AND group_type_id = v_area_type_id AND name = 'Eastern Side';

  -- ========== Unit 1 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 1;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 18,
    back_yard = 36,
    lot_size = 158,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1600000, '$1.60M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 2 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 2;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 9,
    back_yard = 18,
    lot_size = 131,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 3 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 3;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 9,
    back_yard = 18,
    lot_size = 131,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1600000, '$1.60M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 4 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 4;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 17,
    back_yard = 42,
    lot_size = 163,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1650000, '$1.6M – $1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 5 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 5;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 14,
    back_yard = 29,
    lot_size = 147,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 6 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 6;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 14,
    back_yard = 29,
    lot_size = 147,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 7 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 7;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 9,
    back_yard = 18,
    lot_size = 131,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 8 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 8;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 14,
    back_yard = 29,
    lot_size = 147,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 9 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 9;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 45,
    back_yard = 29,
    lot_size = 178,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 10 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 10;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 89,
    upper_balcony = 8,
    patio = 10,
    total_area = 201,
    front_yard = 14,
    back_yard = 25,
    lot_size = 143,
    unit_type_id = v_type_b,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_streetside);

  -- ========== Unit 11 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 11;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 12,
    lot_size = 160,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1630000, 1670000, '$1.63M – $1.67M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 12 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 12;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 12,
    lot_size = 160,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 13 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 13;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 52,
    back_yard = 25,
    lot_size = 181,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 14 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 14;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 54,
    back_yard = 26,
    lot_size = 184,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 15 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 15;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 16 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 16;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 17 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 17;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 52,
    back_yard = 26,
    lot_size = 182,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 18 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 18;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 54,
    back_yard = 27,
    lot_size = 185,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 19 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 19;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 14,
    lot_size = 162,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1620000, '$1.60M – $1.62M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 20 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 20;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 14,
    lot_size = 162
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 21 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 21;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 15,
    lot_size = 163,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1700000, 1730000, '$1.70M – $1.73M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_shopside);

  -- ========== Unit 22 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 22;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 43,
    back_yard = 12,
    lot_size = 159,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1675000, 1675000, '$1.675M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 23 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 23;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 24 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 24;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 25 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 25;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 26 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 26;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 27 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 27;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 28 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 28;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 29 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 29;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 30 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 30;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 31 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 31;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 32 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 32;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 43,
    back_yard = 13,
    lot_size = 160,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage1);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 33 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 33;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1600000, 1640000, '$1.60M – $1.64M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 34 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 34;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 35 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 35;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 36 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 36;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183,
    unit_type_id = v_type_d,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 37 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 37;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 38 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 38;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 39 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 39;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 40 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 40;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 41 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 41;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 42 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 42;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 43 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 43;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 43,
    back_yard = 12,
    lot_size = 159
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1675000, 1675000, '$1.675M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 44 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 44;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 12,
    lot_size = 160
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1675000, 1675000, '$1.675M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 45 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 45;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 46 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 46;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1625000, 1625000, '$1.625M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 47 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 47;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 48 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 48;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 49 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 49;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 50 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 50;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 51 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 51;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 52 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 52;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 53 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 53;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 54 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 54;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 45,
    back_yard = 13,
    lot_size = 162,
    unit_type_id = v_type_cust,
    beds = 4,
    baths = 2.5,
    cars = 2,
    label = '4 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage2);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 55 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 55;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 43,
    back_yard = 13,
    lot_size = 160
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1640000, 1680000, '$1.64M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 56 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 56;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 57 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 57;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 88,
    upper_balcony = 10,
    patio = 10,
    total_area = 202,
    front_yard = 44,
    back_yard = 13,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 58 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 58;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 53,
    back_yard = 26,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1680000, '$1.65M – $1.68M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 59 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 59;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 90,
    upper_balcony = 8,
    patio = 10,
    total_area = 202,
    front_yard = 50,
    back_yard = 26,
    lot_size = 180
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 60 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 60;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 31,
    back_yard = 13,
    lot_size = 148,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 61 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 61;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 91,
    upper_balcony = 10,
    patio = 10,
    total_area = 205,
    front_yard = 20,
    back_yard = 13,
    lot_size = 137,
    unit_type_id = v_type_a,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1650000, 1650000, '$1.65M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 62 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 62;

  UPDATE units SET
    ground_internal = 56,
    ground_garage = 38,
    upper_internal = 86,
    upper_balcony = 10,
    patio = 10,
    total_area = 200,
    front_yard = 13,
    back_yard = 26,
    lot_size = 143
  WHERE id = v_unit_id;

  -- Price: CUSTOM — skipping price update

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 63 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 63;

  UPDATE units SET
    ground_internal = 60,
    ground_garage = 37,
    upper_internal = 90,
    upper_balcony = 10,
    patio = 10,
    total_area = 207,
    front_yard = 22,
    back_yard = 32,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Price: CUSTOM — skipping price update

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 64 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 64;

  UPDATE units SET
    ground_internal = 68,
    ground_garage = 37,
    upper_internal = 97,
    upper_balcony = 11,
    patio = 10,
    total_area = 223,
    front_yard = 32,
    back_yard = 19,
    lot_size = 166,
    unit_type_id = v_type_cust,
    beds = 3,
    baths = 2.5,
    cars = 2,
    label = '3 Bed, 2.5 Bath, 2 Car'
  WHERE id = v_unit_id;

  -- Price: CUSTOM — skipping price update

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_inner_circle);

  -- ========== Unit 65 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 65;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1875000, 1875000, '$1.875M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 66 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 66;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 67 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 67;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 68 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 68;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 69 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 69;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 70 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 70;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 71 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 71;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 72 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 72;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 73 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 73;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 74 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 74;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 75 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 75;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 76 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 76;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 77 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 77;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 78 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 78;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 27,
    lot_size = 183
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 79 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 79;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 20,
    back_yard = 81,
    lot_size = 204
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1900000, '$1.85M – $1.90M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_reserve_outlook);

  -- ========== Unit 80 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 80;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 47,
    back_yard = 11,
    lot_size = 161
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1850000, 1850000, '$1.85M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 81 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 81;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 54,
    back_yard = 24,
    lot_size = 181
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1825000, 1850000, '$1.825M – $1.850M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 82 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 82;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 24,
    lot_size = 180
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1825000, 1850000, '$1.825M – $1.850M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 83 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 83;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 24,
    lot_size = 180
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1825000, 1850000, '$1.825M – $1.850M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 84 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 84;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 25,
    lot_size = 181
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1825000, 1850000, '$1.825M – $1.850M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 85 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 85;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 53,
    back_yard = 24,
    lot_size = 180
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1825000, 1850000, '$1.825M – $1.850M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 86 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 86;

  UPDATE units SET
    ground_internal = 66,
    ground_garage = 37,
    upper_internal = 107,
    upper_balcony = 9,
    patio = 14,
    total_area = 233,
    front_yard = 53,
    back_yard = 44,
    lot_size = 214,
    unit_type_id = v_type_cust
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1825000, 1850000, '$1.825M – $1.850M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 87 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 87;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 45,
    back_yard = 30,
    lot_size = 178
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1825000, 1850000, '$1.825M – $1.850M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  -- ========== Unit 88 ==========
  SELECT id INTO v_unit_id FROM units WHERE project_id = v_project_id AND unit_number = 88;

  UPDATE units SET
    ground_internal = 55,
    ground_garage = 38,
    upper_internal = 95,
    upper_balcony = 10,
    patio = 10,
    total_area = 208,
    front_yard = 55,
    back_yard = 64,
    lot_size = 222
  WHERE id = v_unit_id;

  -- Mark old prices as not current
  UPDATE unit_prices SET is_current = false, effective_to = NOW()
  WHERE unit_id = v_unit_id AND is_current = true;

  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, display_text, is_current, effective_from)
  VALUES (v_unit_id, 'base', 1800000, 1800000, '$1.8M', true, NOW());

  -- Update group assignments (stage + area)
  DELETE FROM unit_groups WHERE unit_id = v_unit_id
    AND group_id IN (v_stage1, v_stage2, v_stage3, v_area_streetside, v_area_shopside, v_area_inner_circle, v_area_reserve_outlook, v_area_eastern_side);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_stage3);
  INSERT INTO unit_groups (unit_id, group_id) VALUES (v_unit_id, v_area_eastern_side);

  RAISE NOTICE 'Successfully updated all 88 units';
END $$;