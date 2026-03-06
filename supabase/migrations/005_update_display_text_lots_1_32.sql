-- Update display_text for Lots 1-32 current prices (LAYA Residences)

DO $$
DECLARE
  v_project_id UUID;
BEGIN
  SELECT id INTO v_project_id FROM projects WHERE slug = 'laya-residences' AND is_active = true;
  IF v_project_id IS NULL THEN
    RAISE EXCEPTION 'Project laya-residences not found';
  END IF;

  UPDATE unit_prices up
  SET display_text = CASE up.price_min
    WHEN 1600000 THEN '$1.60M'
    WHEN 1620000 THEN '$1.62M'
    WHEN 1630000 THEN '$1.63M'
    WHEN 1635000 THEN '$1.635M'
    WHEN 1650000 THEN '$1.65M'
    WHEN 1675000 THEN '$1.675M'
    WHEN 1680000 THEN '$1.68M'
  END
  FROM units u
  WHERE up.unit_id = u.id
    AND u.project_id = v_project_id
    AND u.unit_number BETWEEN 1 AND 32
    AND up.is_current = true;

  RAISE NOTICE 'Updated display_text for current prices of lots 1-32';
END $$;
