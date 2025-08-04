import React, { useState } from 'react'
import { Search, MapPin } from 'lucide-react'

const SearchForm = ({ onSearch, isLoading }) => {
  const [radius, setRadius] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const radiusValue = parseFloat(radius)
    
    if (radiusValue && radiusValue > 0) {
      onSearch(radiusValue)
    }
  }

  return (
    <div className="search-section">
      <div className="search-header">
        <MapPin className="search-icon" />
        <h1>Find Nearby Parking Zones</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <label htmlFor="radius">Search Radius (km)</label>
          <input
            id="radius"
            type="number"
            step="0.1"
            min="0.1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="Enter radius in kilometers"
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading} className="search-btn">
          <Search size={18} />
          {isLoading ? 'Searching...' : 'Search Parking Zones'}
        </button>
      </form>
    </div>
  )
}

export default SearchForm