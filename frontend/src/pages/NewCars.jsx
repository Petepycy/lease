import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewCars.css';

const useResponsiveGrid = () => {
  const [carsPerPage, setCarsPerPage] = useState(getInitialCarsPerPage());

  function getInitialCarsPerPage() {
    const width = window.innerWidth;
    if (width >= 1400) return 9;      // Large desktop
    if (width >= 1200) return 6;      // Desktop
    if (width >= 768) return 4;       // Tablet
    return 3;                         // Mobile
  }

  useEffect(() => {
    function handleResize() {
      setCarsPerPage(getInitialCarsPerPage());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return carsPerPage;
};

const NewCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    make: '',
    priceRange: '',
    bodyType: ''
  });

  const carsPerPage = useResponsiveGrid();

  // Reset to first page when filters change or cars per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, carsPerPage]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/cars/');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
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
    if (filters.bodyType && car.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/car-placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) return `http://localhost:8000${imagePath}`;
    return `http://localhost:8000/media/${imagePath}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="new-cars">
      <div className="container">
        <div className="new-cars__filters">
          <h2 className="section-title">Filter Cars</h2>
          <div className="new-cars__filter-group">
            <label htmlFor="make">Make</label>
            <select
              id="make"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              className="new-cars__select"
            >
              <option value="">All Makes</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Tesla">Tesla</option>
              <option value="Audi">Audi</option>
            </select>
          </div>

          <div className="new-cars__filter-group">
            <label htmlFor="priceRange">Price Range</label>
            <select
              id="priceRange"
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="new-cars__select"
            >
              <option value="">All Prices</option>
              <option value="0-30000">Under $30,000</option>
              <option value="30000-50000">$30,000 - $50,000</option>
              <option value="50000-80000">$50,000 - $80,000</option>
              <option value="80000-100000">$80,000 - $100,000</option>
              <option value="100000-999999">Over $100,000</option>
            </select>
          </div>

          <div className="new-cars__filter-group">
            <label htmlFor="bodyType">Body Type</label>
            <select
              id="bodyType"
              value={filters.bodyType}
              onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
              className="new-cars__select"
            >
              <option value="">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Coupe">Coupe</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>
        </div>

        <div className="new-cars__content">
          <div className="new-cars__grid">
            {currentCars.length > 0 ? (
              currentCars.map((car) => (
                <div
                  key={car.id}
                  className="new-cars__card"
                >
                  <div className="new-cars__card-image">
                    <img src={getImageUrl(car.image)} alt={`${car.make} ${car.model}`} />
                  </div>
                  <div className="new-cars__card-info">
                    <h3 className="new-cars__card-title">{car.make} {car.model}</h3>
                    <p className="new-cars__card-price">${car.price ? car.price.toLocaleString() : '0'}</p>
                    <p className="new-cars__card-description">{car.description || 'No description available'}</p>
                    <div className="new-cars__card-features">
                      {car.mileage && <span>{car.mileage} MPG</span>}
                      {car.transmission && <span>{car.transmission}</span>}
                      {car.bodyType && <span>{car.bodyType}</span>}
                    </div>
                    <Link to={`/car-details/${car.id}`} className="btn btn--secondary">View Details</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="new-cars__no-results">
                <p>No cars match your current filters. Try adjusting your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="new-cars__pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="new-cars__pagination-btn"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`new-cars__pagination-btn ${currentPage === index + 1 ? 'new-cars__pagination-btn--active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="new-cars__pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCars; 