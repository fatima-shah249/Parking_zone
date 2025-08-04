/*
  # Create Parking System Tables

  1. New Tables
    - `location_of_slots`
      - `slot_id` (integer, primary key)
      - `location` (text, parking zone name)
      - `latitude` (float, GPS coordinate)
      - `longitude` (float, GPS coordinate)
      - `available_slots` (integer, number of free spots)
      - `occupied_slots` (integer, number of taken spots)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_locations` (for ESP32 GPS tracking)
      - `id` (integer, primary key)
      - `latitude` (float, user GPS coordinate)
      - `longitude` (float, user GPS coordinate)
      - `updated_at` (timestamp)

  2. Functions
    - `find_nearby_slots` - Calculates distance using Haversine formula
    - `update_slot_availability` - Updates parking slot counts

  3. Security
    - Enable RLS on both tables
    - Add policies for public read access to parking data
    - Add policies for location updates
*/

-- Create location_of_slots table
CREATE TABLE IF NOT EXISTS location_of_slots (
  slot_id SERIAL PRIMARY KEY,
  location TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  available_slots INTEGER NOT NULL DEFAULT 0,
  occupied_slots INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_locations table for GPS tracking
CREATE TABLE IF NOT EXISTS user_locations (
  id SERIAL PRIMARY KEY,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE location_of_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for location_of_slots (public read access)
CREATE POLICY "Anyone can read parking slots"
  ON location_of_slots
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update parking slots"
  ON location_of_slots
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for user_locations
CREATE POLICY "Anyone can read user locations"
  ON user_locations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert/update user locations"
  ON user_locations
  FOR ALL
  TO public
  USING (true);

-- Create function to find nearby parking slots using Haversine formula
CREATE OR REPLACE FUNCTION find_nearby_slots(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT DEFAULT 5.0
)
RETURNS TABLE (
  slot_id INTEGER,
  location TEXT,
  latitude FLOAT,
  longitude FLOAT,
  available_slots INTEGER,
  occupied_slots INTEGER,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ls.slot_id,
    ls.location,
    ls.latitude,
    ls.longitude,
    ls.available_slots,
    ls.occupied_slots,
    (
      6371 * ACOS(
        COS(RADIANS(user_lat)) * 
        COS(RADIANS(ls.latitude)) * 
        COS(RADIANS(ls.longitude) - RADIANS(user_lng)) +
        SIN(RADIANS(user_lat)) * 
        SIN(RADIANS(ls.latitude))
      )
    ) AS distance_km
  FROM location_of_slots ls
  WHERE (
    6371 * ACOS(
      COS(RADIANS(user_lat)) * 
      COS(RADIANS(ls.latitude)) * 
      COS(RADIANS(ls.longitude) - RADIANS(user_lng)) +
      SIN(RADIANS(user_lat)) * 
      SIN(RADIANS(ls.latitude))
    )
  ) <= radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to update slot availability
CREATE OR REPLACE FUNCTION update_slot_availability(
  p_slot_id INTEGER,
  p_available INTEGER,
  p_occupied INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE location_of_slots 
  SET 
    available_slots = p_available,
    occupied_slots = p_occupied,
    updated_at = NOW()
  WHERE slot_id = p_slot_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_location_coords ON location_of_slots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_location_updated ON location_of_slots(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_location_updated ON user_locations(updated_at);