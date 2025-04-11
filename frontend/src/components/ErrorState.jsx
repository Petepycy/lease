import React from 'react';

const ErrorState = ({ message }) => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  </div>
);

export default ErrorState; 