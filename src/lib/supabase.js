import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to find nearby parking slots
export const findNearbySlots = async (latitude, longitude, radiusKm) => {
  try {
    const { data, error } = await supabase.rpc('find_nearby_slots', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radiusKm
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error finding nearby slots:', error)
    throw error
  }
}

// Function to get all parking slots
export const getAllSlots = async () => {
  try {
    const { data, error } = await supabase
      .from('location_of_slots')
      .select('*')
      .order('slot_id')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching slots:', error)
    throw error
  }
}

// Function to update location (for ESP32 integration)
export const updateLocation = async (latitude, longitude) => {
  try {
    const { data, error } = await supabase
      .from('user_locations')
      .upsert({
        id: 1, // Single user for now
        latitude,
        longitude,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating location:', error)
    throw error
  }
}