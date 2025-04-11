import React from 'react';

const CarGallery = ({ car }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {car.year} {car.make} {car.model}
      </h1>
      <p className="text-gray-500 mb-6">Premium Vehicle</p>
      
      <div className="relative rounded-lg overflow-hidden aspect-[16/10]">
        <img
          src={car.image || '/placeholder-image.png'}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
);

export default CarGallery; 