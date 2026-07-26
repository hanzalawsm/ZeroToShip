PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS providers;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE providers (
  provider_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plumber', 'electrician', 'carpenter', 'painter', 'cleaner')),
  neighborhood_zone TEXT NOT NULL CHECK (
    neighborhood_zone IN ('Gulshan', 'Johar', 'Clifton', 'DHA', 'Nazimabad', 'North Nazimabad', 'PECHS', 'Malir')
  ),
  rating REAL NOT NULL CHECK (rating >= 0 AND rating <= 5)
);

CREATE TABLE bookings (
  booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (provider_id) REFERENCES providers(provider_id)
);
