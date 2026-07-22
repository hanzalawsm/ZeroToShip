PRAGMA foreign_keys = ON;

SELECT 'providers_exist' AS check_name,
       CASE WHEN COUNT(*) >= 8 THEN 'PASS' ELSE 'FAIL' END AS result,
       COUNT(*) AS observed_value
FROM providers;

SELECT 'gulshan_and_johar_exist' AS check_name,
       CASE
         WHEN COUNT(DISTINCT neighborhood_zone) = 2 THEN 'PASS'
         ELSE 'FAIL'
       END AS result,
       COUNT(DISTINCT neighborhood_zone) AS observed_value
FROM providers
WHERE neighborhood_zone IN ('Gulshan', 'Johar');

SELECT 'valid_provider_categories_only' AS check_name,
       CASE
         WHEN COUNT(*) = 0 THEN 'PASS'
         ELSE 'FAIL'
       END AS result,
       COUNT(*) AS observed_value
FROM providers
WHERE category NOT IN ('plumber', 'electrician', 'carpenter', 'painter', 'cleaner');

SELECT 'valid_provider_zones_only' AS check_name,
       CASE
         WHEN COUNT(*) = 0 THEN 'PASS'
         ELSE 'FAIL'
       END AS result,
       COUNT(*) AS observed_value
FROM providers
WHERE neighborhood_zone NOT IN ('Gulshan', 'Johar', 'Clifton', 'DHA', 'Nazimabad', 'North Nazimabad', 'PECHS', 'Malir');

SELECT 'provider_rating_range' AS check_name,
       CASE
         WHEN COUNT(*) = 0 THEN 'PASS'
         ELSE 'FAIL'
       END AS result,
       COUNT(*) AS observed_value
FROM providers
WHERE rating < 0 OR rating > 5;

SELECT 'valid_booking_status_only' AS check_name,
       CASE
         WHEN COUNT(*) = 0 THEN 'PASS'
         ELSE 'FAIL'
       END AS result,
       COUNT(*) AS observed_value
FROM bookings
WHERE status NOT IN ('Pending', 'Confirmed', 'Completed', 'Cancelled');

SELECT 'no_orphaned_user_fk' AS check_name,
       CASE
         WHEN COUNT(*) = 0 THEN 'PASS'
         ELSE 'FAIL'
       END AS result,
       COUNT(*) AS observed_value
FROM bookings b
LEFT JOIN users u ON u.user_id = b.user_id
WHERE u.user_id IS NULL;

SELECT 'no_orphaned_provider_fk' AS check_name,
       CASE
         WHEN COUNT(*) = 0 THEN 'PASS'
         ELSE 'FAIL'
       END AS result,
       COUNT(*) AS observed_value
FROM bookings b
LEFT JOIN providers p ON p.provider_id = b.provider_id
WHERE p.provider_id IS NULL;
