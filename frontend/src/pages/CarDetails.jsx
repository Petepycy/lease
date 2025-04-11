import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LeasingCalculator from '../components/LeasingCalculator';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { FaCalendarAlt, FaTachometerAlt, FaGasPump, FaCog } from 'react-icons/fa'; // Import necessary icons

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!car) return <ErrorState message="Car details are unavailable." />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* --- Main Two Column Layout using Flexbox --- */}
        {/* Stacks vertically on small screens, row on large screens */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* --- Left Column (Image, Title, Key Info) --- */}
          {/* Takes available space, fixed width on large screens can be set if needed */}
          {/* lg:w-1/2 or similar could be used if flex-1 doesn't behave as expected */} 
          <div className="flex-1 space-y-6">
            {/* Car Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={car.image || '/placeholder-car.jpg'}
                alt={`${car.make} ${car.model}`}
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            {/* Car Title */}
            <div className="px-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-md text-gray-500 mt-1">Premium Vehicle</p>
            </div>
            {/* Key Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">Key Information</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <div className="flex items-start space-x-3">
                  <FaCalendarAlt className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="text-md font-medium text-gray-800">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaTachometerAlt className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="text-md font-medium text-gray-800">{car.mileage?.toLocaleString() || 'N/A'} km</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaGasPump className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="text-md font-medium text-gray-800">{car.fuel_type}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCog className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="text-md font-medium text-gray-800">{car.transmission}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column (Leasing Calculator) --- */}
          {/* Takes available space, fixed width on large screens can be set if needed */}
          {/* lg:w-1/2 or similar */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-10">
              <LeasingCalculator carId={car.id} />
              {/* <div className="bg-red-200 h-96 flex items-center justify-center text-red-800 font-semibold">
                Calculator Placeholder
              </div> */}
            </div>
          </div>
        </div>

        {/* --- Full Width Sections Below --- */}
        <div className="mt-10 lg:mt-12 space-y-8">
          {/* Vehicle Specifications Card */}
          {car.specifications?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-5">
                {car.specifications.map((spec, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500 capitalize">{spec.label}</p>
                    <p className="text-md font-medium text-gray-800">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Description Card */}
          {car.description && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">Vehicle Description</h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                 <p className="whitespace-pre-line">{car.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;