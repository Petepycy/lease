import React from 'react';

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
      <p className="text-lg font-semibold text-gray-700">Loading car details...</p>
    </div>
  </div>
);

export default LoadingState; 