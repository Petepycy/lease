import React from 'react';

const SpecificationCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-teal-500 transition-colors">
    <div className="p-3 bg-teal-50 rounded-lg">
      <Icon className="w-5 h-5 text-teal-600" />
    </div>
    <div className="ml-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value || 'N/A'}</p>
    </div>
  </div>
);

export default SpecificationCard; 