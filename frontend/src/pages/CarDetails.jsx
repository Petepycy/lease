import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/CarDetails.css';

// Base64 encoded placeholder image
const FALLBACK_IMAGE_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNOTAgODBIMTEwQzExNS41MjMgODAgMTIwIDg0LjQ3NzIgMTIwIDkwVjExMEMxMjAgMTE1LjUyMyAxMTUuNTIzIDEyMCAxMTAgMTIwSDkwQzg0LjQ3NzIgMTIwIDgwIDExNS41MjMgODAgMTEwVjkwQzgwIDg0LjQ3NzIgODQuNDc3MiA4MCA5MCA4MFoiIGZpbGw9IiM5Q0EzQUYiLz48cGF0aCBkPSJNMTEwIDg1SDkwQzg3LjIzODYgODUgODUgODcuMjM4NiA4NSA5MFYxMTBDODUgMTEyLjc2MSA4Ny4yMzg2IDExNSA5MCAxMTVIMTEwQzExMi43NjEgMTE1IDExNSAxMTIuNzYxIDExNSAxMTBWOTBDMTE1IDg3LjIzODYgMTEyLjc2MSA4NSAxMTAgODVaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const detailsRef = useRef(null);
  
  // New state for gallery
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  // Add these new state variables and functions at the top of the component, after the existing state declarations:
  const [downPayment, setDownPayment] = useState(car?.price ? Math.round(car.price * 0.1) : 0);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(3.99);

  // Handle keyboard events for modal navigation
  const handleKeyDown = useCallback((e) => {
    if (!isModalOpen) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        setCurrentImageIndex((prev) => 
          prev === 0 ? images.length - 1 : prev - 1
        );
        break;
      case 'ArrowRight':
        setCurrentImageIndex((prev) => 
          prev === images.length - 1 ? 0 : prev + 1
        );
        break;
      case 'Escape':
        setIsModalOpen(false);
        break;
      default:
        break;
    }
  }, [isModalOpen, images.length]);

  // Add/remove keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cars/${id}/`);
        if (!response.ok) throw new Error('Car not found');
        const data = await response.json();
        setCar(data);
        
        // Set up images array from car data
        const carImages = data.car_images?.map(img => img.image_url || img.image) || [];
        if (data.default_image_url && !carImages.includes(data.default_image_url)) {
          carImages.unshift(data.default_image_url);
        }
        setImages(carImages.length > 0 ? carImages : [FALLBACK_IMAGE_BASE64]);

        // Fetch related cars (excluding current car)
        const relatedData = await fetch('http://localhost:8000/api/cars/').then(res => res.json());
        setRelatedCars(
          relatedData
            .filter(c => c.id !== parseInt(id))
            .slice(0, 3)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getImageUrl = (car) => {
    if (car.default_image_url) {
      return car.default_image_url;
    }
    
    if (car.car_images && car.car_images.length > 0) {
      const firstImage = car.car_images[0];
      return firstImage.image_url || firstImage.image;
    }
    
    return FALLBACK_IMAGE_BASE64;
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const calculateMonthlyPayment = () => {
    if (!car?.price) return 0;
    
    const loanAmount = car.price - downPayment;
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = leaseTerm;
    
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  const calculateTotalCost = () => {
    const monthlyPayment = calculateMonthlyPayment();
    return downPayment + (monthlyPayment * leaseTerm);
  };

  if (loading) return <div className="car-details__loading">Loading...</div>;
  if (error) return <div className="car-details__error">{error}</div>;
  if (!car) return <div className="car-details__error">Car not found</div>;

  return (
    <div className="car-details">
      {/* Hero Section */}
      <section 
        className="car-details__hero"
        style={{ backgroundImage: `url(${getImageUrl(car)})` }}
      >
        <div className="car-details__hero-overlay">
          <div className="car-details__hero-content">
            <span className="car-details__year">{car.year}</span>
            <h1 className="car-details__title">{car.make} {car.model}</h1>
            <p className="car-details__price">${car.price?.toLocaleString()}</p>
            <div className="car-details__cta">
              <button className="car-details__button">Email us</button>
              <button className="car-details__button">Call us</button>
            </div>
          </div>
        </div>
        <button className="car-details__scroll-indicator" onClick={scrollToDetails}>
          More Details ↓
        </button>
      </section>

      {/* Info Bar */}
      <section className="car-details__info-bar" ref={detailsRef}>
        <div className="car-details__info-item">
          <span className="info-label">Przebieg</span>
          <span className="info-value">{car.mileage?.toLocaleString()} km</span>
        </div>
        <div className="car-details__info-item">
          <span className="info-label">Rodzaj paliwa</span>
          <span className="info-value">{car.fuel_type || 'Benzyna'}</span>
        </div>
        <div className="car-details__info-item">
          <span className="info-label">Skrzynia biegów</span>
          <span className="info-value">{car.transmission || 'Automatyczna'}</span>
        </div>
        <div className="car-details__info-item">
          <span className="info-label">Typ nadwozia</span>
          <span className="info-value">{car.body_type || 'Coupe'}</span>
        </div>
        <div className="car-details__info-item">
          <span className="info-label">Pojemność skokowa</span>
          <span className="info-value">{car.engine_capacity || '6.5'} L</span>
        </div>
        <div className="car-details__info-item">
          <span className="info-label">Moc</span>
          <span className="info-value">{car.power || '800'} KM</span>
        </div>
      </section>

      {/* Gallery */}
      <section className="car-details__gallery">
        <div className="car-details__gallery-container">
          <button 
            className="car-details__gallery-nav car-details__gallery-nav--prev"
            onClick={() => handlePrevImage()}
            aria-label="Previous image"
          >
            ←
          </button>
          
          <div className="car-details__gallery-slider">
            {images.map((image, index) => (
              <div 
                key={index}
                className="car-details__gallery-item"
                onClick={() => openModal(index)}
              >
                <img 
                  src={image} 
                  alt={`${car.make} ${car.model} - View ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <button 
            className="car-details__gallery-nav car-details__gallery-nav--next"
            onClick={() => handleNextImage()}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      </section>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="car-details__modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="car-details__modal-content">
            <button 
              className="car-details__modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            
            <button 
              className="car-details__modal-nav car-details__modal-nav--prev"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              ←
            </button>

            <div className="car-details__modal-image-container">
              <img 
                src={images[currentImageIndex]} 
                alt={`${car.make} ${car.model} - View ${currentImageIndex + 1}`}
              />
            </div>

            <button 
              className="car-details__modal-nav car-details__modal-nav--next"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              →
            </button>

            <div className="car-details__modal-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <section className="car-details__description">
        <h2>Opis</h2>
        <div className="car-details__description-content">
          {car.description}
        </div>
      </section>

      {/* Leasing Calculator */}
      <section className="car-details__leasing">
        <h2>Kalkulator Leasingu</h2>
        <div className="car-details__leasing-calculator">
          <div className="car-details__leasing-inputs">
            <div className="leasing-input-group">
              <label htmlFor="carPrice">Cena pojazdu</label>
              <div className="input-with-prefix">
                <span>$</span>
                <input
                  type="number"
                  id="carPrice"
                  value={car.price || 0}
                  disabled
                />
              </div>
            </div>

            <div className="leasing-input-group">
              <label htmlFor="downPayment">Wpłata własna</label>
              <div className="input-with-prefix">
                <span>$</span>
                <input
                  type="number"
                  id="downPayment"
                  defaultValue={Math.round(car.price * 0.1)}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0 && value <= car.price) {
                      setDownPayment(value);
                    }
                  }}
                />
              </div>
            </div>

            <div className="leasing-input-group">
              <label htmlFor="leaseTerm">Okres leasingu (miesiące)</label>
              <select 
                id="leaseTerm"
                defaultValue={36}
                onChange={(e) => setLeaseTerm(parseInt(e.target.value))}
              >
                <option value={24}>24 miesiące</option>
                <option value={36}>36 miesięcy</option>
                <option value={48}>48 miesięcy</option>
                <option value={60}>60 miesięcy</option>
              </select>
            </div>

            <div className="leasing-input-group">
              <label htmlFor="interestRate">Oprocentowanie roczne (%)</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  id="interestRate"
                  defaultValue={3.99}
                  step="0.01"
                  min="0"
                  max="20"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0 && value <= 20) {
                      setInterestRate(value);
                    }
                  }}
                />
                <span>%</span>
              </div>
            </div>
          </div>

          <div className="car-details__leasing-summary">
            <div className="leasing-summary-item">
              <span>Miesięczna rata:</span>
              <strong>${calculateMonthlyPayment().toFixed(2)}</strong>
            </div>
            <div className="leasing-summary-item">
              <span>Całkowity koszt leasingu:</span>
              <strong>${calculateTotalCost().toFixed(2)}</strong>
            </div>
            <button className="car-details__leasing-cta">
              Zapytaj o leasing
            </button>
          </div>
        </div>
      </section>

      {/* Related Cars */}
      <section className="car-details__related">
        <h2>Zobacz też</h2>
        <div className="car-details__related-grid">
          {relatedCars.map(relatedCar => (
            <Link 
              to={`/car-details/${relatedCar.id}`} 
              key={relatedCar.id}
              className="car-details__related-card"
            >
              <div className="car-details__related-image">
                <img src={getImageUrl(relatedCar)} alt={`${relatedCar.make} ${relatedCar.model}`} />
              </div>
              <div className="car-details__related-info">
                <h3>{relatedCar.make} {relatedCar.model}</h3>
                <p className="car-details__related-price">
                  ${relatedCar.price?.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CarDetails;