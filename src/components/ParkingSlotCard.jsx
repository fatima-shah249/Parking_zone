import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Car, Navigation, Clock } from 'lucide-react'

const ParkingSlotCard = ({ slot }) => {
  const navigate = useNavigate()

  const handleShowRoute = () => {
    navigate(`/map?lat=${slot.latitude}&lng=${slot.longitude}&id=${slot.slot_id}`)
  }

  const getAvailabilityStatus = () => {
    const total = slot.available_slots + slot.occupied_slots
    const availabilityPercentage = (slot.available_slots / total) * 100

    if (availabilityPercentage > 50) return 'high'
    if (availabilityPercentage > 20) return 'medium'
    return 'low'
  }

  return (
    <div className="parking-card">
      <div className="card-header">
        <div className="zone-info">
          <h3>Zone {slot.slot_id}</h3>
          <div className="location-info">
            <MapPin size={16} />
            <span>{slot.location}</span>
          </div>
        </div>
        <div className={`availability-badge ${getAvailabilityStatus()}`}>
          {slot.available_slots} available
        </div>
      </div>

      <div className="card-content">
        <div className="slot-stats">
          <div className="stat-item">
            <Car size={18} />
            <div>
              <span className="stat-label">Available</span>
              <span className="stat-value">{slot.available_slots}</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="occupied-icon"></div>
            <div>
              <span className="stat-label">Occupied</span>
              <span className="stat-value">{slot.occupied_slots}</span>
            </div>
          </div>
          <div className="stat-item">
            <Navigation size={18} />
            <div>
              <span className="stat-label">Distance</span>
              <span className="stat-value">{slot.distance_km?.toFixed(2)} km</span>
            </div>
          </div>
        </div>

        <button className="route-btn" onClick={handleShowRoute}>
          <Navigation size={16} />
          Show Route on Map
        </button>
      </div>
    </div>
  )
}

export default ParkingSlotCard