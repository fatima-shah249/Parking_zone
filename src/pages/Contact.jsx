import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="contact-subtitle">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Whether you need help using the app, want to report an issue, or have 
              suggestions for improvement, don't hesitate to reach out.
            </p>

            <div className="contact-methods">
              <div className="contact-method">
                <Mail className="contact-icon" />
                <div>
                  <h3>Email</h3>
                  <p>support@smartparking.com</p>
                </div>
              </div>

              <div className="contact-method">
                <Phone className="contact-icon" />
                <div>
                  <h3>Phone</h3>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-method">
                <MapPin className="contact-icon" />
                <div>
                  <h3>Address</h3>
                  <p>123 Tech Park, Bangalore, Karnataka 560001</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>
                <MessageCircle size={24} />
                Send us a Message
              </h2>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact