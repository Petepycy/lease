import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Grid } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/grid';
import '../styles/CarBrands.css';

const CarBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/brands/');
        setBrands(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands');
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) return `http://localhost:8000${imagePath}`;
    return `http://localhost:8000/media/${imagePath}`;
  };

  if (loading) return <div className="loading">Loading brands...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!brands.length) return null;

  return (
    <section className="car-brands">
      <div className="container">
        <h2>Popular Brands</h2>
        <div className="brands-grid">
          <Swiper
            modules={[Autoplay, Grid]}
            grid={{
              rows: 2,
              fill: 'row'
            }}
            spaceBetween={30}
            slidesPerView={2}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                grid: { rows: 2 },
                spaceBetween: 15
              },
              640: {
                grid: { rows: 2 }
              },
              1024: {
                grid: { rows: 2 }
              }
            }}
            className="car-brands-swiper"
          >
            {brands.map(brand => (
              <SwiperSlide key={brand.id}>
                <div className="brand-card">
                  <div className="brand-logo">
                    <img src={getImageUrl(brand.logo)} alt={`${brand.name} logo`} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CarBrands; 