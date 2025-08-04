import React, { useState } from 'react'
import { useLocation } from '../context/LocationContext'
import { findNearbySlots } from '../lib/supabase'
import GPSStatus from '../components/GPSStatus'
import SearchForm from '../components/SearchForm'
import ParkingSlotCard from '../components/ParkingSlotCard'
import { AlertCircle } from 'lucide-react'

const Home = () => {
  const { location } = useLocation()
  const [slots, setSlots] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchRadius, setSearchRadius] = useState(null)

  const handleSearch = async (radius) => {
    if (radius <= 0) {
      setError('Please enter a valid radius greater than 0')
      return
    }

    setIsLoading(true)
    setError(null)
    setSearchRadius(radius)

    try {
      const nearbySlots = await findNearbySlots(
        location.latitude,
        location.longitude,
        radius
      )
      setSlots(nearbySlots || [])
    } catch (err) {
      setError('Failed to find nearby parking slots. Please try again.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="home-page">
      <div className="container">
        <GPSStatus />
        
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {searchRadius && (
          <div className="results-section">
            <h2 className="results-title">
              {slots.length > 0 
                ? `Found ${slots.length} parking zones within ${searchRadius} km`
                : `No parking zones found within ${searchRadius} km`
              }
            </h2>

            {slots.length > 0 && (
              <div className="slots-grid">
                {slots.map((slot) => (
                  <ParkingSlotCard key={slot.slot_id} slot={slot} />
                ))}
              </div>
            )}

            {slots.length === 0 && searchRadius && (
              <div className="no-results">
                <p>Try increasing the search radius or check your location settings.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home