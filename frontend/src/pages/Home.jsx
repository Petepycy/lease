import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import CarBrands from '../components/CarBrands';
import ProcessSection from '../components/ProcessSection';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import '../styles/Home.css';
import axios from 'axios';

const Home = () => {
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch slideshow images
        const slideshowResponse = await axios.get('http://localhost:8000/api/slideshow-images/');
        console.log('Slideshow images:', slideshowResponse.data);
        setSlideshowImages(slideshowResponse.data.filter(img => img.active));
        
        // Fetch cars
        const carsResponse = await axios.get('http://localhost:8000/api/cars/');
        console.log('Cars data:', carsResponse.data);
        
        // Sort cars by price in descending order and take top 6
        const sortedCars = [...carsResponse.data]
          .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
          .slice(0, 6);
        
        setCars(sortedCars);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to correctly format image URL
  const getImageUrl = (car) => {
    // Use the default_image_url if available
    if (car.default_image_url) return car.default_image_url;
    
    // Fallback to the first car image if available
    if (car.car_images && car.car_images.length > 0) {
      return car.car_images[0].image_url;
    }
    
    // If no images are available, return a placeholder
    return '/placeholder-car.jpg';
  };

  // Helper function to group cars into pairs for slides
  const getCarPairs = () => {
    const pairs = [];
    for (let i = 0; i < cars.length; i += 2) {
      if (i + 1 < cars.length) {
        // If we have a pair
        pairs.push([cars[i], cars[i + 1]]);
      } else {
        // If we have an odd number of cars, the last one goes alone
        pairs.push([cars[i]]);
      }
    }
    return pairs;
  };

  return (
    <div className="home-page">
      <section className="hero">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : slideshowImages.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            className="hero-swiper"
          >
            {slideshowImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div 
                  className="hero-slide" 
                  style={{ backgroundImage: `url(${getImageUrl({ default_image_url: image.image })})` }}
                >
                  <div className="overlay"></div>
                  <div className="hero-content">
                    <h1>{image.title}</h1>
                    <p>{image.description}</p>
                    <Link to="/new-cars" className="btn-primary">FIND A CAR</Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="hero-content">
            <h1>Leasing From D&M</h1>
            <Link to="/new-cars" className="btn-primary">FIND A CAR</Link>
          </div>
        )}
      </section>

      <section className="featured-cars">
        <div className="container">
          <h2>Featured Vehicles</h2>
          {loading ? (
            <div className="loading">Loading cars...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : cars.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              className="mySwiper"
            >
              {getCarPairs().map((pair, index) => (
                <SwiperSlide key={index}>
                  <div className="car-pair">
                    {pair.map(car => (
                      <div className="car-card" key={car.id}>
                        <img src={getImageUrl(car)} alt={`${car.year} ${car.make} ${car.model}`} />
                        <h3>{car.year} {car.make} {car.model}</h3>
                        <p>Starting from ${car.price}/month</p>
                        <Link to={`/car-details/${car.id}`} className="btn-secondary">Learn More</Link>
                      </div>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="no-cars">No featured vehicles available</div>
          )}
        </div>
      </section>

      <ProcessSection />

      <CarBrands />

      <section className="benefits">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <i className="fas fa-car"></i>
              <h3>Wide Selection</h3>
              <p>Choose from our extensive collection of vehicles</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-percent"></i>
              <h3>Competitive Rates</h3>
              <p>Get the best leasing deals in the market</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Peace of Mind</h3>
              <p>Comprehensive warranty and support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 