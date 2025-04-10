import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Leasing From D&M</h1>
          <Link to="/new-cars" className="btn-primary">FIND A CAR</Link>
        </div>
      </section>

      <section className="featured-cars">
        <div className="container">
          <h2>Featured Vehicles</h2>
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
            <SwiperSlide>
              <div className="car-card">
                <img src="/images/tesla-model3.jpg" alt="Tesla Model 3" />
                <h3>2023 Tesla Model 3</h3>
                <p>Starting from $399/month</p>
                <Link to="/new-cars" className="btn-secondary">Learn More</Link>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="car-card">
                <img src="/images/bmw-3series.jpg" alt="BMW 3 Series" />
                <h3>2023 BMW 3 Series</h3>
                <p>Starting from $499/month</p>
                <Link to="/new-cars" className="btn-secondary">Learn More</Link>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="car-card">
                <img src="/images/mercedes-cclass.jpg" alt="Mercedes C-Class" />
                <h3>2023 Mercedes C-Class</h3>
                <p>Starting from $549/month</p>
                <Link to="/new-cars" className="btn-secondary">Learn More</Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

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