-- Update prices for Lots 1-32 (LAYA Residences)
-- Min and Max are the same for each lot

DO $$
DECLARE
  v_project_id UUID;
  v_unit_id UUID;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- Get project ID
  SELECT id INTO v_project_id FROM projects WHERE slug = 'laya-residences' AND is_active = true;
  IF v_project_id IS NULL THEN
    RAISE EXCEPTION 'Project laya-residences not found';
  END IF;

  -- Helper: temp table with lot prices
  CREATE TEMP TABLE lot_prices (lot INT, price BIGINT) ON COMMIT DROP;
  INSERT INTO lot_prices (lot, price) VALUES
    (1,  1600000),
    (2,  1600000),
    (3,  1600000),
    (4,  1600000),
    (5,  1600000),
    (6,  1600000),
    (7,  1600000),
    (8,  1600000),
    (9,  1600000),
    (10, 1635000),
    (11, 1650000),
    (12, 1620000),
    (13, 1620000),
    (14, 1650000),
    (15, 1620000),
    (16, 1650000),
    (17, 1650000),
    (18, 1650000),
    (19, 1620000),
    (20, 1650000),
    (21, 1680000),
    (22, 1675000),
    (23, 1630000),
    (24, 1630000),
    (25, 1650000),
    (26, 1650000),
    (27, 1630000),
    (28, 1630000),
    (29, 1650000),
    (30, 1630000),
    (31, 1630000),
    (32, 1650000);

  -- For each lot, expire the current price and insert the new one
  FOR v_unit_id IN
    SELECT u.id
    FROM units u
    JOIN lot_prices lp ON lp.lot = u.unit_number
    WHERE u.project_id = v_project_id
    ORDER BY u.unit_number
  LOOP
    -- Mark existing current prices as not current
    UPDATE unit_prices
    SET is_current = false, effective_to = v_now
    WHERE unit_id = v_unit_id AND is_current = true;
  END LOOP;

  -- Insert new prices
  INSERT INTO unit_prices (unit_id, price_type, price_min, price_max, is_current, changed_by, change_reason)
  SELECT
    u.id,
    'base',
    lp.price,
    lp.price,
    true,
    'migration',
    'Price update March 2026'
  FROM units u
  JOIN lot_prices lp ON lp.lot = u.unit_number
  WHERE u.project_id = v_project_id;

  RAISE NOTICE 'Updated prices for % lots', (SELECT COUNT(*) FROM lot_prices);
END $$;
