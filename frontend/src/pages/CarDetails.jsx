import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LeasingCalculator from '../components/LeasingCalculator';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { FaCalendarAlt, FaTachometerAlt, FaGasPump, FaCog, FaMapMarkerAlt, FaPaintBrush, FaChair, FaGlobeAmericas, FaChevronLeft, FaChevronRight, FaExpand, FaQuestionCircle, FaArrowRight } from 'react-icons/fa'; // Added more icons
import '../styles/CarDetails.css'; // Add import for the new CSS file

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isThumbnailSliderOpen, setIsThumbnailSliderOpen] = useState(false);

  // Use images array directly from the API response
  const images = car?.images || [];

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/cars/${id}/`);
        setCar(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Failed to load car details. Please try again later.');
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-car.jpg';
    
    // Handle full URLs (including S3 URLs)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Handle S3 key format
    if (imagePath.startsWith('cars/')) {
      const s3BaseUrl = import.meta.env.VITE_S3_BASE_URL || 'https://your-bucket.s3.region.amazonaws.com';
      return `${s3BaseUrl}/${imagePath}`;
    }
    
    // Legacy support for local media files
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const cleanedApiUrl = apiUrl.replace(/\/$/, '');
    const cleanedImagePath = imagePath.startsWith('/media/') ? imagePath.substring(1) : imagePath;
    return `${cleanedApiUrl}/${cleanedImagePath}`;
  };
  
  // Basic Info items configuration
  const basicInfoItems = [
    { icon: FaCalendarAlt, value: car?.year, label: 'Rok' },
    { icon: FaTachometerAlt, value: car?.mileage?.toLocaleString(), label: 'Przebieg', unit: 'km' },
    { icon: FaGasPump, value: car?.fuel_type, label: 'Paliwo' },
    { icon: FaCog, value: car?.transmission, label: 'Skrzynia biegów' },
  ];

  // Detailed Specs items configuration
  const detailedSpecsItems = [
    { label: 'Pojemność silnika', value: car?.engine_capacity, unit: 'cm³' },
    { label: 'Moc silnika', value: car?.power, unit: 'KM' },
    { label: 'Kolor', value: car?.color },
    { label: 'Typ nadwozia', value: car?.body_type },
    { label: 'Liczba miejsc', value: car?.seats },
    { label: 'Kraj pochodzenia', value: car?.origin_country },
  ];

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleThumbnailSlider = () => {
    setIsThumbnailSliderOpen(!isThumbnailSliderOpen);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!car) return <ErrorState message="Car details are unavailable." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-12">
        <div className="lg:w-3/5 space-y-8 md:space-y-10 mb-8 lg:mb-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="car-details__image-container">
              <img
                src={getImageUrl(images[currentImageIndex])}
                alt={`${car.make} ${car.model}`}
                className="car-details__main-image"
              />
              <button
                onClick={handlePrevImage}
                className="car-details__prev-button"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={handleNextImage}
                className="car-details__next-button"
                aria-label="Next image"
              >
                →
              </button>
            </div>
            
            <div className="car-details__thumbnails-container">
              <button
                onClick={toggleThumbnailSlider}
                className="car-details__thumbnails-toggle"
              >
                {isThumbnailSliderOpen ? 'Hide Thumbnails' : 'Show Thumbnails'}
              </button>
              
              {isThumbnailSliderOpen && (
                <div className="car-details__thumbnails-slider">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`car-details__thumbnail ${
                        index === currentImageIndex ? 'car-details__thumbnail--active' : ''
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Informacje podstawowe</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {basicInfoItems.map((item, index) => item.value ? (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                  <item.icon className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-gray-800">
                        {item.value}{item.unit ? <span className="text-xs"> {item.unit}</span> : ''}
                    </p>
                  </div>
                </div>
              ) : null)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Dane techniczne</h2>
            <div className="space-y-3">
              {detailedSpecsItems.map((item, index) => item.value ? (
                <div key={index} className="flex justify-between items-center pt-3 border-t border-gray-100 first:pt-0 first:border-t-0">
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">
                      {item.value}{item.unit ? <span className="text-xs"> {item.unit}</span> : ''}
                  </p>
                </div>
               ) : null)}
            </div>
          </div>

          {car.description && (
            <div className="bg-white rounded-lg shadow-md p-6 md:p-7">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5">Opis pojazdu</h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p className="whitespace-pre-line">{car.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-2/5">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-5 md:p-6">
              <LeasingCalculator carId={id} carPrice={car.price} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 btn-outline">
                <FaQuestionCircle className="mr-2" /> Zadaj pytanie
              </button>
              <button className="flex-1 btn-primary-green">
                Wnioskuj online <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;