import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeasingCalculator from '../components/LeasingCalculator';
import '../styles/NewCars.css';

const NewCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [filters, setFilters] = useState({
    make: '',
    priceRange: '',
    bodyType: ''
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/cars/');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        console.log('Fetched cars:', data); // Debug log
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    if (filters.make && car.make.toLowerCase() !== filters.make.toLowerCase()) {
      return false;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (car.price < min || car.price > max) {
        return false;
      }
    }
    if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
      return false;
    }
    return true;
  });

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="new-cars-page">
      <section className="hero">
        <div className="container">
          <h1>New Cars for Lease</h1>
          <p>Find your perfect car with flexible leasing options</p>
        </div>
      </section>

      <div className="container main-content">
        <div className="filters">
          <h2>Filter Cars</h2>
          <div className="filter-group">
            <label htmlFor="make">Make</label>
            <select
              id="make"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
            >
              <option value="">All Makes</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Tesla">Tesla</option>
              <option value="Audi">Audi</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priceRange">Price Range</label>
            <select
              id="priceRange"
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            >
              <option value="">All Prices</option>
              <option value="0-30000">Under $30,000</option>
              <option value="30000-50000">$30,000 - $50,000</option>
              <option value="50000-80000">$50,000 - $80,000</option>
              <option value="80000-100000">$80,000 - $100,000</option>
              <option value="100000-999999">Over $100,000</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="bodyType">Body Type</label>
            <select
              id="bodyType"
              value={filters.bodyType}
              onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Coupe">Coupe</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>
        </div>

        <div className="cars-grid">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className={`car-card ${selectedCar?.id === car.id ? 'selected' : ''}`}
              onClick={() => handleCarSelect(car)}
            >
              <img src={car.image} alt={car.model} />
              <div className="car-info">
                <h3>{car.make} {car.model}</h3>
                <p className="price">From ${car.price.toLocaleString()}</p>
                <p className="description">{car.description}</p>
                <div className="features">
                  <span>{car.mileage} MPG</span>
                  <span>{car.transmission}</span>
                  <span>{car.bodyType}</span>
                </div>
                <button className="btn-secondary">View Details</button>
              </div>
            </div>
          ))}
        </div>

        <div className="calculator-section">
          <h2>Calculate Your Lease Payment</h2>
          <LeasingCalculator selectedCar={selectedCar} />
        </div>
      </div>
    </div>
  );
};

export default NewCars; 