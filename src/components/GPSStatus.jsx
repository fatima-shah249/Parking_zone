import React from 'react'
import { useLocation } from '../context/LocationContext'
import { MapPin, Satellite, Clock } from 'lucide-react'

const GPSStatus = () => {
  const { location, gpsStatus, isTracking, startTracking, stopTracking } = useLocation()

  return (
    <div className="gps-status-card">
      <div className="gps-header">
        <div className="gps-title">
          <Satellite className={`gps-icon ${isTracking ? 'active' : ''}`} />
          <h3>GPS Status</h3>
        </div>
        <button 
          className={`gps-toggle ${isTracking ? 'stop' : 'start'}`}
          onClick={isTracking ? stopTracking : startTracking}
        >
          {isTracking ? 'Stop' : 'Start'} GPS
        </button>
      </div>
      
      <div className="gps-info">
        <p className="gps-status">{gpsStatus}</p>
        
        {location.latitude && location.longitude && (
          <div className="location-details">
            <div className="location-item">
              <MapPin size={16} />
              <span>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </span>
            </div>
            
            {location.accuracy && (
              <div className="location-item">
                <span className="accuracy-badge">
                  ±{Math.round(location.accuracy)}m accuracy
                </span>
              </div>
            )}
            
            {location.timestamp && (
              <div className="location-item">
                <Clock size={16} />
                <span>
                  Updated: {new Date(location.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GPSStatus