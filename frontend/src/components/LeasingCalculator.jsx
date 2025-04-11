import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaInfoCircle, FaCheck, FaStar, FaChevronRight, FaChevronLeft } from 'react-icons/fa'; // Added Chevrons
import '../styles/LeasingCalculator.css'; // Ensure CSS is imported

// Helper function to format numbers
const formatNumber = (num) => num?.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0';

// Simplified Toggle Button
const ToggleButton = ({ value, isSelected, onClick, children, disabled = false }) => (
  <button
    onClick={() => onClick(value)}
    disabled={disabled}
    className={`toggle-button ${isSelected ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
  >
    {children}
  </button>
);

// Package Option Card
const PackageOption = ({ title, features, isSelected, onSelect, isRecommended = false }) => (
  <div
    onClick={onSelect}
    className={`package-option ${isSelected ? 'active' : ''}`}
  >
    {isRecommended && (
      <div className="recommendation-badge">
        <FaStar className="w-3 h-3" />
      </div>
    )}
    <div className="package-option-header">
      <span className={`radio-indicator ${isSelected ? 'active' : ''}`}>
        {isSelected && <FaCheck className="w-3 h-3 text-white" />}
      </span>
      <h4 className="font-semibold text-gray-800">{title}</h4>
    </div>
    <ul className="package-option-features">
      {features.map((feature, index) => (
        <li key={index}>
          <FaCheck className="text-teal-500" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Tab Button Component
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`tab-button ${isActive ? 'active' : ''}`}
  >
    {label}
  </button>
);

const LeasingCalculator = ({ carId, carPrice }) => {
  const [activeTab, setActiveTab] = useState('consumer'); // Default to leasing
  const [initialPaymentPercent, setInitialPaymentPercent] = useState(10);
  const [contractMonths, setContractMonths] = useState(36);
  const [annualMileage, setAnnualMileage] = useState(30000);
  const [packageType, setPackageType] = useState('comfort');
  const [monthlyRate, setMonthlyRate] = useState(null);
  const [calculatedInitialPaymentValue, setCalculatedInitialPaymentValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialPaymentOptions = [0, 5, 10, 15, 20, 30];
  const contractLengthOptions = [12, 24, 36, 48];
  const annualMileageOptions = [20000, 30000, 40000];
  
  // Map internal state to API leasing_type
  const getLeasingTypeFromTab = (tab) => {
    switch(tab) {
      case 'rental': return 'rental';
      case 'consumer': return 'consumer';
      case 'cash': return 'cash';
      default: return 'consumer';
    }
  };

  useEffect(() => {
    if (carPrice && initialPaymentPercent !== null) {
      const value = (carPrice * initialPaymentPercent) / 100;
      setCalculatedInitialPaymentValue(value);
    } else {
      setCalculatedInitialPaymentValue(null);
    }
  }, [carPrice, initialPaymentPercent]);

  const calculateLease = useCallback(async () => {
    if (!carId || carPrice === undefined) {
      setError('Missing car information for calculation.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      car_id: carId,
      initial_payment_percent: initialPaymentPercent,
      contract_months: contractMonths,
      annual_mileage: annualMileage,
      package_type: packageType,
      leasing_type: getLeasingTypeFromTab(activeTab), // Use mapped type
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/api/leasing/calculate/`, payload);
      setMonthlyRate(response.data.monthly_rate);
      setCalculatedInitialPaymentValue(response.data.initial_payment_value);
    } catch (err) {
      console.error('Error calculating lease:', err);
      setError('Calculation failed. Check parameters or try again.');
      setMonthlyRate(null);
      setCalculatedInitialPaymentValue(null);
    } finally {
      setLoading(false);
    }
  }, [carId, carPrice, initialPaymentPercent, contractMonths, annualMileage, packageType, activeTab]);

  useEffect(() => {
    if (carId && carPrice !== undefined) {
        calculateLease();
    }
  }, [calculateLease, carId, carPrice]);

  return (
    <div className="leasing-calculator-container">
      {/* Tabs */}
      <div className="tabs-container">
        <TabButton label="Wynajem" isActive={activeTab === 'rental'} onClick={() => setActiveTab('rental')} />
        <TabButton label="Leasing konsumencki" isActive={activeTab === 'consumer'} onClick={() => setActiveTab('consumer')} />
        <TabButton label="Pożyczka gotówkowa" isActive={activeTab === 'cash'} onClick={() => setActiveTab('cash')} />
      </div>

      {/* Monthly Rate Display */}
      <div className="rate-display">
        {loading ? (
          <div className="loading-placeholder rate-loading">
            <div className="pulse-bg rate-line-1"></div>
            <div className="pulse-bg rate-line-2"></div>
          </div>
        ) : error ? (
           <div className="error-message">
             <p className="font-semibold">Błąd kalkulacji</p>
             <p className="text-sm">{error}</p>
           </div>
        ) : monthlyRate !== null ? (
          <>
            <div className="monthly-rate">
              {formatNumber(monthlyRate)} zł
            </div>
            <p className="rate-note">za miesiąc brutto</p>
          </>
        ) : (
          <div className="rate-placeholder">Wybierz opcje, aby zobaczyć cenę.</div>
        )}
      </div>

      {/* Options Sections - Adjusted Layout */}
      <div className="options-grid">
        {/* Initial Payment */}
        <div className="option-section">
          <label className="option-label">
            Opłata na start {calculatedInitialPaymentValue !== null ? 
              <span className="font-semibold">({formatNumber(calculatedInitialPaymentValue)} zł)</span> : ''}
          </label>
          <div className="button-group">
            {initialPaymentOptions.map(percent => (
              <ToggleButton
                key={`ip-${percent}`}
                value={percent}
                isSelected={initialPaymentPercent === percent}
                onClick={setInitialPaymentPercent}
              >
                {percent}%
              </ToggleButton>
            ))}
          </div>
        </div>

        {/* Contract Length & Mileage - Grouped */}
        <div className="option-section">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="option-label">
                        Okres umowy <span className="label-unit">(miesiące)</span>
                    </label>
                    <div className="button-group">
                        {contractLengthOptions.map(months => (
                        <ToggleButton
                            key={`m-${months}`}
                            value={months}
                            isSelected={contractMonths === months}
                            onClick={setContractMonths}
                        >
                            {months}
                        </ToggleButton>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="option-label">
                        Roczny limit km
                    </label>
                    <div className="button-group">
                        {annualMileageOptions.map(km => (
                        <ToggleButton
                            key={`km-${km}`}
                            value={km}
                            isSelected={annualMileage === km}
                            onClick={setAnnualMileage}
                        >
                            {km/1000} tys.
                        </ToggleButton>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Package Selection */}
        <div className="option-section">
          <label className="option-label">
            Pakiet
          </label>
          <div className="package-options-container">
            <PackageOption
              title="Basic"
              features={['Koordynacja likwidacji szkód', 'Ubezpieczenie']}
              isSelected={packageType === 'basic'}
              onSelect={() => setPackageType('basic')}
            />
            <PackageOption
              title="Comfort"
              features={[
                'Koordynacja likwidacji szkód',
                'Ubezpieczenie',
                'Auto zastępcze',
                'Serwis',
                'Opony'
              ]}
              isSelected={packageType === 'comfort'}
              onSelect={() => setPackageType('comfort')}
              isRecommended={true}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons are now in CarDetails.jsx */}
    </div>
  );
};

export default LeasingCalculator; 