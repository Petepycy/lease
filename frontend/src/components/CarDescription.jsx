import React from 'react';
import { FaCar, FaTachometerAlt, FaGasPump, FaCog } from 'react-icons/fa';

const QuickSpec = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <Icon className="w-4 h-4 text-teal-600" />
    <span className="text-sm">{value}</span>
  </div>
);

const CarDescription = ({ car }) => {
  const quickSpecs = [
    { icon: FaCar, value: `${car.year} ${car.make} ${car.model}` },
    { icon: FaTachometerAlt, value: `${car.mileage?.toLocaleString() || 'N/A'} km` },
    { icon: FaGasPump, value: car.fuel_type || 'N/A' },
    { icon: FaCog, value: car.transmission || 'N/A' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="relative aspect-[16/9]">
          <img
            src={car.image || '/placeholder-image.png'}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Quick Specs Bar */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 border-t border-gray-100">
          {quickSpecs.map((spec, index) => (
            <QuickSpec key={index} icon={spec.icon} value={spec.value} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      {car.features && car.features.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Equipment</h3>
          <div className="grid grid-cols-2 gap-3">
            {car.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description Section */}
      {car.description && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
        </div>
      )}
    </div>
  );
};

export default CarDescription; 