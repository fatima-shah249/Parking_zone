import React, { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    latitude: 12.9250, // Default to Bangalore
    longitude: 77.5938,
    accuracy: null,
    timestamp: null
  })
  const [gpsStatus, setGpsStatus] = useState('Initializing GPS...')
  const [isTracking, setIsTracking] = useState(false)

  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsStatus('GPS not supported by this browser')
      return
    }

    setIsTracking(true)
    setGpsStatus('Requesting location access...')

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    }

    const successCallback = (position) => {
      const { latitude, longitude, accuracy } = position.coords
      setLocation({
        latitude,
        longitude,
        accuracy,
        timestamp: new Date().toISOString()
      })
      setGpsStatus(`GPS Active - Accuracy: ${Math.round(accuracy)}m`)
    }

    const errorCallback = (error) => {
      let message = 'GPS Error: '
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message += 'Location access denied'
          break
        case error.POSITION_UNAVAILABLE:
          message += 'Location unavailable'
          break
        case error.TIMEOUT:
          message += 'Location request timeout'
          break
        default:
          message += 'Unknown error'
      }
      setGpsStatus(message)
      setIsTracking(false)
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options)

    return () => {
      navigator.geolocation.clearWatch(watchId)
      setIsTracking(false)
    }
  }

  const stopTracking = () => {
    setIsTracking(false)
    setGpsStatus('GPS tracking stopped')
  }

  useEffect(() => {
    // Auto-start tracking on mount
    const cleanup = startTracking()
    return cleanup
  }, [])

  const value = {
    location,
    gpsStatus,
    isTracking,
    startTracking,
    stopTracking,
    setLocation
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}