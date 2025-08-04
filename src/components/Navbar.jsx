import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MapPin, Home, Info, Phone, User } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/contact', label: 'Contact Us', icon: Phone },
  ]

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <MapPin className="nav-icon" />
        <span>Smart Parking</span>
      </div>
      <ul className="nav-links">
        {navItems.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <Link 
              to={path} 
              className={location.pathname === path ? 'active' : ''}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button className="login-btn">
            <User size={18} />
            <span>Login</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar