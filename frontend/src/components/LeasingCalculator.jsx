import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaInfoCircle, FaCheck } from 'react-icons/fa'; // Using react-icons for potential info icons
// import '../styles/LeasingCalculator.css'; // Temporarily comment out to check for conflicts

// Helper function to format numbers (optional, for display)
const formatNumber = (num) => num?.toLocaleString('pl-PL') || '';

const TabButton = ({ id, current, label, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
      current === id
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

const OptionButton = ({ value, isSelected, onClick, children, disabled = false }) => (
  <button
    onClick={() => onClick(value)}
    disabled={disabled}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
      isSelected
        ? 'bg-teal-600 text-white shadow-sm'
        : 'bg-white text-gray-700 border border-gray-200 hover:border-teal-500'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const PackageOption = ({ title, price, features, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
      isSelected ? 'border-teal-500 bg-teal-50/30' : 'border-gray-200 hover:border-teal-300'
    }`}
  >
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <span className="text-sm text-teal-600 font-medium">+{price} PLN</span>
    </div>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
          <FaCheck className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const LeasingCalculator = ({ carId }) => {
  const [leasingType, setLeasingType] = useState('rental');
  const [initialPaymentPercent, setInitialPaymentPercent] = useState(10);
  const [contractMonths, setContractMonths] = useState(36);
  const [annualMileage, setAnnualMileage] = useState(30000);
  const [packageType, setPackageType] = useState('comfort');
  const [monthlyRate, setMonthlyRate] = useState(null);
  const [calculatedInitialPaymentValue, setCalculatedInitialPaymentValue] = useState(null); // Store calculated zł value
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialPaymentOptions = [0, 5, 10, 15, 20, 30];
  const contractLengthOptions = [12, 24, 36, 48];
  const annualMileageOptions = [20000, 30000, 40000];

  const calculateLease = useCallback(async () => {
    if (!carId) return;
    setLoading(true);
    setError(null);

    const payload = {
      car_id: carId,
      initial_payment_percent: initialPaymentPercent,
      contract_months: contractMonths,
      annual_mileage: annualMileage,
      package_type: packageType,
      leasing_type: leasingType,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/api/leasing/calculate/`, payload);
      setMonthlyRate(response.data.monthly_rate);
      setCalculatedInitialPaymentValue(response.data.initial_payment_value); // Assuming API returns this
    } catch (err) {
      console.error('Error calculating lease:', err);
      setError('Calculation failed. Please try again.');
      setMonthlyRate(null); // Clear rate on error
      setCalculatedInitialPaymentValue(null);
      console.error('Lease calculation error details:', err); // Correct: use the caught error object
    } finally {
      setLoading(false);
    }
  }, [carId, initialPaymentPercent, contractMonths, annualMileage, packageType, leasingType]);

  useEffect(() => {
    calculateLease();
  }, [calculateLease]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      {/* Monthly Rate Display */}
      <div className="text-center pb-6 border-b border-gray-100">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900">
              {monthlyRate?.toLocaleString()} PLN
              <span className="text-base font-normal text-gray-500">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Gross price including VAT</p>
          </>
        )}
      </div>

      {/* Leasing Type Tabs */}
      <div className="flex border-b border-gray-200">
        <TabButton
          id="rental"
          current={leasingType}
          label="Rental"
          onClick={setLeasingType}
        />
        <TabButton
          id="consumer"
          current={leasingType}
          label="Consumer Leasing"
          onClick={setLeasingType}
        />
        <TabButton
          id="cash"
          current={leasingType}
          label="Cash Loan"
          onClick={setLeasingType}
        />
      </div>

      {/* Options */}
      <div className="space-y-5">
        {/* Initial Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial payment {calculatedInitialPaymentValue !== null ? `(${formatNumber(calculatedInitialPaymentValue)} zł)` : ''}
          </label>
          <div className="flex flex-wrap gap-2">
            {initialPaymentOptions.map(percent => (
              <OptionButton
                key={percent}
                value={percent}
                isSelected={initialPaymentPercent === percent}
                onClick={setInitialPaymentPercent}
              >
                {percent}%
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Contract Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract duration
          </label>
          <div className="flex flex-wrap gap-2">
            {contractLengthOptions.map(months => (
              <OptionButton
                key={months}
                value={months}
                isSelected={contractMonths === months}
                onClick={setContractMonths}
              >
                {months} months
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Annual Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual mileage
          </label>
          <div className="flex flex-wrap gap-2">
            {annualMileageOptions.map(km => (
              <OptionButton
                key={km}
                value={km}
                isSelected={annualMileage === km}
                onClick={setAnnualMileage}
              >
                {km/1000}k km
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Package Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Package type
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <PackageOption
              title="Basic"
              price="0"
              features={['Damage coordination', 'Insurance']}
              isSelected={packageType === 'basic'}
              onSelect={() => setPackageType('basic')}
            />
            <PackageOption
              title="Comfort"
              price="299"
              features={[
                'Damage coordination',
                'Insurance',
                'Replacement car',
                'Service',
                'Tires'
              ]}
              isSelected={packageType === 'comfort'}
              onSelect={() => setPackageType('comfort')}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3">
        <button className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Ask a question
        </button>
        <button className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
          Apply online
        </button>
      </div>
    </div>
  );
};

export default LeasingCalculator; 