PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

INSERT INTO users (user_id, name, email, password_hash) VALUES
  (1, 'Ali Khan', 'ali.khan@example.com', 'hash_ali_001'),
  (2, 'Sara Ahmed', 'sara.ahmed@example.com', 'hash_sara_002'),
  (3, 'Hamza Raza', 'hamza.raza@example.com', 'hash_hamza_003'),
  (4, 'Noor Fatima', 'noor.fatima@example.com', 'hash_noor_004'),
  (5, 'Ayesha Iqbal', 'ayesha.iqbal@example.com', 'hash_ayesha_005');

INSERT INTO providers (provider_id, name, category, neighborhood_zone, rating) VALUES
  (1, 'Imran Plumbing Works', 'plumber', 'Gulshan', 4.7),
  (2, 'Nadeem Electric Services', 'electrician', 'Johar', 4.5),
  (3, 'Karachi Quick Plumbers', 'plumber', 'Clifton', 4.2),
  (4, 'PowerFix Electricians', 'electrician', 'DHA', 4.8),
  (5, 'City Carpenter Hub', 'carpenter', 'Nazimabad', 4.1),
  (6, 'Fresh Coat Painters', 'painter', 'North Nazimabad', 4.3),
  (7, 'Spark & Pipe Team', 'plumber', 'PECHS', 4.0),
  (8, 'CleanSpace Crew', 'cleaner', 'Malir', 4.4),
  (9, 'Johar Handy Plumbers', 'plumber', 'Johar', 3.9),
  (10, 'Gulshan Electric Point', 'electrician', 'Gulshan', 4.6);

INSERT INTO bookings (booking_id, user_id, provider_id, booking_time, status) VALUES
  (1, 1, 1, '2026-07-25 10:00:00', 'Pending'),
  (2, 2, 2, '2026-07-25 12:00:00', 'Confirmed'),
  (3, 3, 4, '2026-07-26 09:30:00', 'Completed'),
  (4, 4, 6, '2026-07-26 14:15:00', 'Cancelled'),
  (5, 5, 10, '2026-07-27 11:45:00', 'Pending'),
  (6, 2, 9, '2026-07-27 16:20:00', 'Confirmed');

COMMIT;
