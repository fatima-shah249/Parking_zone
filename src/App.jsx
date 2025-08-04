import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import MapView from './pages/MapView'
import { LocationProvider } from './context/LocationContext'
import './App.css'

function App() {
  return (
    <LocationProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </div>
    </LocationProvider>
  )
}

export default App