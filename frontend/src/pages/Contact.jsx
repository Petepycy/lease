import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_contact: 'email',
    subject: '',
    message: '',
    preferred_vehicle: '',
    budget_range: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/contact-submissions/', formData);
      setStatus({ type: 'success', message: 'Thank you for your submission. We will contact you soon.' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferred_contact: 'email',
        subject: '',
        message: '',
        preferred_vehicle: '',
        budget_range: ''
      });
    } catch {
      setStatus({ type: 'error', message: 'There was an error submitting your form. Please try again.' });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We're here to help you find your perfect vehicle</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-section">
            <h2>Our Information</h2>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Our Location</h3>
                  <p>123 Auto Drive, City, State 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>(123) 456-7890</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>info@leasecars.com</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="map-section">
            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2155710122!2d-73.9878448!3d40.7579887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzI4LjgiTiA3M8KwNTknMTQuMiJX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
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
              <label htmlFor="email">Email *</label>
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
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferred_contact">Preferred Contact Method *</label>
              <select
                id="preferred_contact"
                name="preferred_contact"
                value={formData.preferred_contact}
                onChange={handleChange}
                required
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
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
              <label htmlFor="preferred_vehicle">Preferred Vehicle (Optional)</label>
              <input
                type="text"
                id="preferred_vehicle"
                name="preferred_vehicle"
                value={formData.preferred_vehicle}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget_range">Budget Range (Optional)</label>
              <select
                id="budget_range"
                name="budget_range"
                value={formData.budget_range}
                onChange={handleChange}
              >
                <option value="">Select Budget Range</option>
                <option value="under-500">Under $500/month</option>
                <option value="500-1000">$500 - $1000/month</option>
                <option value="1000-1500">$1000 - $1500/month</option>
                <option value="over-1500">Over $1500/month</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact; 