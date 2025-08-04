/*
  # Insert Sample Parking Data

  1. Sample Data
    - 20 parking locations around Bangalore
    - Realistic GPS coordinates
    - Varied availability numbers
    - Popular locations like malls, tech parks, hospitals

  2. Data Coverage
    - Different areas of Bangalore
    - Mix of high and low availability
    - Various parking zone sizes
*/

-- Insert sample parking locations around Bangalore
INSERT INTO location_of_slots (location, latitude, longitude, available_slots, occupied_slots) VALUES
  ('UB City Mall', 12.9716, 77.5946, 45, 155),
  ('Brigade Road Shopping', 12.9716, 77.6033, 12, 88),
  ('Commercial Street', 12.9833, 77.6167, 8, 42),
  ('Forum Mall Koramangala', 12.9279, 77.6271, 67, 133),
  ('Phoenix MarketCity', 12.9279, 77.6848, 89, 211),
  ('Manyata Tech Park', 13.0358, 77.6211, 234, 566),
  ('Electronic City Phase 1', 12.8456, 77.6603, 156, 344),
  ('Whitefield ITPL', 12.9698, 77.7500, 178, 422),
  ('Indiranagar Metro Station', 12.9719, 77.6412, 23, 77),
  ('Koramangala 5th Block', 12.9352, 77.6245, 34, 66),
  ('Jayanagar 4th Block', 12.9237, 77.5838, 28, 52),
  ('Rajajinagar Metro Station', 12.9915, 77.5554, 19, 41),
  ('Malleshwaram Circle', 13.0031, 77.5727, 15, 35),
  ('Basavanagudi Bull Temple', 12.9435, 77.5847, 22, 38),
  ('HSR Layout Sector 1', 12.9082, 77.6476, 41, 79),
  ('BTM Layout 2nd Stage', 12.9165, 77.6101, 33, 67),
  ('Banashankari Temple', 12.9250, 77.5500, 18, 32),
  ('Vijayanagar Metro Station', 12.9634, 77.5311, 26, 54),
  ('Cunningham Road', 12.9750, 77.5900, 14, 36),
  ('MG Road Metro Station', 12.9750, 77.6069, 31, 69)
ON CONFLICT (slot_id) DO NOTHING;

-- Insert a sample user location (for ESP32 tracking)
INSERT INTO user_locations (id, latitude, longitude) VALUES
  (1, 12.9250, 77.5938)
ON CONFLICT (id) DO UPDATE SET
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();