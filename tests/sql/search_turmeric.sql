-- Manual smoke checks for the search_turmeric RPC. Run inside Supabase SQL editor or psql.
SELECT jsonb_pretty(to_jsonb(search_turmeric('spinach', 'ingredient'))) AS ingredient_matches;
SELECT jsonb_pretty(to_jsonb(search_turmeric('green', 'drink')))      AS drink_matches;
SELECT jsonb_pretty(to_jsonb(search_turmeric('iron', 'nutrient')))    AS nutrient_matches;

DO $$
BEGIN
  PERFORM search_turmeric('', 'ingredient');
  RAISE WARNING 'Expected empty-query call to raise an exception';
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Empty query rejected as expected: %', SQLERRM;
END;
$$;
