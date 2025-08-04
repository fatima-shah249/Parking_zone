import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useLocation } from '../context/LocationContext'
import { ArrowLeft, Navigation, MapPin } from 'lucide-react'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const parkingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const MapView = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { location } = useLocation()
  const [mapCenter, setMapCenter] = useState([12.9250, 77.5938])
  const [destinationInfo, setDestinationInfo] = useState(null)

  useEffect(() => {
    const lat = parseFloat(searchParams.get('lat'))
    const lng = parseFloat(searchParams.get('lng'))
    const id = searchParams.get('id')

    if (lat && lng) {
      setMapCenter([lat, lng])
      setDestinationInfo({
        lat,
        lng,
        id: id || 'Unknown',
        name: `Parking Zone ${id || 'Unknown'}`
      })
    }
  }, [searchParams])

  const handleGetDirections = () => {
    if (destinationInfo) {
      const googleMapsUrl = `https://www.google.com/maps/dir/${location.latitude},${location.longitude}/${destinationInfo.lat},${destinationInfo.lng}`
      window.open(googleMapsUrl, '_blank')
    }
  }

  return (
    <div className="map-page">
      <div className="map-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="map-title">
          <MapPin size={20} />
          <h1>Navigation Map</h1>
        </div>

        {destinationInfo && (
          <button className="directions-btn" onClick={handleGetDirections}>
            <Navigation size={18} />
            Get Directions
          </button>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          <Marker 
            position={[location.latitude, location.longitude]} 
            icon={userIcon}
          >
            <Popup>
              <div className="popup-content">
                <h3>Your Location</h3>
                <p>Current GPS position</p>
              </div>
            </Popup>
          </Marker>

          {/* Destination marker */}
          {destinationInfo && (
            <Marker 
              position={[destinationInfo.lat, destinationInfo.lng]} 
              icon={parkingIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{destinationInfo.name}</h3>
                  <p>Parking destination</p>
                  <button 
                    className="popup-btn"
                    onClick={handleGetDirections}
                  >
                    Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {destinationInfo && (
        <div className="map-info">
          <div className="destination-card">
            <h3>Destination: {destinationInfo.name}</h3>
            <p>Coordinates: {destinationInfo.lat.toFixed(6)}, {destinationInfo.lng.toFixed(6)}</p>
            <p>Distance from your location will be calculated by your navigation app</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView