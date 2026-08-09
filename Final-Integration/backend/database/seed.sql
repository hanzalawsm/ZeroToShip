INSERT INTO providers (name, category, neighborhood_zone, rating, review_count, response_time, completion_rate, hourly_rate, experience_years, verified, avatar_url, specialities, phone, available_now) VALUES
('Ali Khan', 'plumber', 'Gulshan', 4.8, 120, '15 mins', 0.98, 'PKR 1500/hr', 5, 1, 'https://ui-avatars.com/api/?name=Ali+Khan', '["Pipe Fitting", "Leak Repair"]', '0300-1234567', 1),
('Tariq Electrician', 'electrician', 'Johar', 4.9, 210, '10 mins', 0.99, 'PKR 1800/hr', 8, 1, 'https://ui-avatars.com/api/?name=Tariq+Electrician', '["Wiring", "UPS Repair"]', '0311-9876543', 1),
('Nadeem Woodworks', 'carpenter', 'DHA', 4.5, 45, '30 mins', 0.95, 'PKR 2000/hr', 12, 1, 'https://ui-avatars.com/api/?name=Nadeem+Woodworks', '["Furniture Repair", "Door Fitting"]', '0333-2345678', 0),
('Salman Painter', 'painter', 'Clifton', 4.2, 30, '1 hour', 0.90, 'PKR 1200/hr', 3, 0, 'https://ui-avatars.com/api/?name=Salman+Painter', '["Wall Painting", "Polishing"]', '0345-8765432', 1),
('Asif Cleaning Services', 'cleaner', 'PECHS', 4.7, 85, '20 mins', 0.97, 'PKR 1000/hr', 4, 1, 'https://ui-avatars.com/api/?name=Asif+Cleaning', '["Deep Cleaning", "Carpet Washing"]', '0322-3456789', 1),
('Kamran Plumber', 'plumber', 'Nazimabad', 4.1, 12, '45 mins', 0.85, 'PKR 1300/hr', 2, 0, 'https://ui-avatars.com/api/?name=Kamran+Plumber', '["Water Tank Cleaning", "Tap Replacement"]', '0301-4567890', 1),
('Zahid Electrician', 'electrician', 'North Nazimabad', 4.6, 150, '25 mins', 0.94, 'PKR 1600/hr', 6, 1, 'https://ui-avatars.com/api/?name=Zahid+Electrician', '["AC Servicing", "Circuit Repair"]', '0312-5678901', 0),
('Faizan Carpenter', 'carpenter', 'Malir', 4.8, 90, '15 mins', 0.98, 'PKR 1700/hr', 7, 1, 'https://ui-avatars.com/api/?name=Faizan+Carpenter', '["Custom Furniture", "Cabinets"]', '0334-6789012', 1),
('Rahim Paint Co.', 'painter', 'Gulshan', 4.4, 55, '30 mins', 0.92, 'PKR 1400/hr', 5, 0, 'https://ui-avatars.com/api/?name=Rahim+Paint', '["Exterior Painting", "Waterproofing"]', '0346-7890123', 1),
('Imran Sweepers', 'cleaner', 'Johar', 4.9, 300, '5 mins', 1.0, 'PKR 800/hr', 10, 1, 'https://ui-avatars.com/api/?name=Imran+Sweepers', '["Home Sanitization", "Pest Control"]', '0321-8901234', 1);

-- Seed user for testing (password is 'password123')
INSERT INTO users (name, email, password_hash, phone, avatar_url) VALUES 
('Test User', 'test@example.com', '$2b$12$h3D1P46kR1T.m26wU/zU0eYw/4L5c7kZz9F5C5q9yN6KqXj7a8Q3O', '0300-0000000', 'https://ui-avatars.com/api/?name=Test+User');
