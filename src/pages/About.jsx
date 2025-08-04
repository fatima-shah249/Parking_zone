import React from 'react'
import { MapPin, Smartphone, Navigation, Shield } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Real-time Location',
      description: 'Uses GPS technology to pinpoint your exact location and find the nearest parking spots.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Optimized for mobile devices with responsive design for on-the-go parking search.'
    },
    {
      icon: Navigation,
      title: 'Turn-by-turn Directions',
      description: 'Get detailed navigation to your chosen parking spot with integrated mapping.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your location data is processed securely and never stored without permission.'
    }
  ]

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>About Smart Parking Finder</h1>
          <p className="about-subtitle">
            Making parking easier with intelligent location-based search
          </p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              Smart Parking Finder is designed to solve the everyday challenge of finding 
              available parking spaces in busy urban areas. Using advanced GPS technology 
              and real-time data, we help drivers locate the nearest parking zones quickly 
              and efficiently.
            </p>
          </section>

          <section className="features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <feature.icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Enable Location</h3>
                  <p>Allow the app to access your GPS location for accurate results.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Set Search Radius</h3>
                  <p>Choose how far you're willing to travel to find parking.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Find & Navigate</h3>
                  <p>View available spots and get directions to your chosen location.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About