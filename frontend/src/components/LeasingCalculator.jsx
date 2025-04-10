import React, { useState } from 'react';
import '../styles/LeasingCalculator.css';

const LeasingCalculator = () => {
  const [formData, setFormData] = useState({
    carPrice: '',
    downPayment: '',
    leaseTerm: 36,
    interestRate: 5,
    residualValue: 50,
  });

  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePayment = (e) => {
    e.preventDefault();
    
    const {
      carPrice,
      downPayment,
      leaseTerm,
      interestRate,
      residualValue
    } = formData;

    // Convert to numbers
    const price = parseFloat(carPrice);
    const down = parseFloat(downPayment);
    const term = parseInt(leaseTerm);
    const rate = parseFloat(interestRate) / 100;
    const residual = parseFloat(residualValue) / 100;

    // Calculate residual value
    const residualAmount = price * residual;

    // Calculate depreciation
    const depreciation = price - down - residualAmount;

    // Calculate monthly depreciation
    const monthlyDepreciation = depreciation / term;

    // Calculate monthly interest
    const monthlyInterest = (price + residualAmount) * (rate / 12);

    // Calculate total monthly payment
    const payment = monthlyDepreciation + monthlyInterest;

    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div className="leasing-calculator">
      <h2>Leasing Calculator</h2>
      <form onSubmit={calculatePayment}>
        <div className="form-group">
          <label htmlFor="carPrice">Car Price ($)</label>
          <input
            type="number"
            id="carPrice"
            name="carPrice"
            value={formData.carPrice}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="downPayment">Down Payment ($)</label>
          <input
            type="number"
            id="downPayment"
            name="downPayment"
            value={formData.downPayment}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="leaseTerm">Lease Term (months)</label>
          <select
            id="leaseTerm"
            name="leaseTerm"
            value={formData.leaseTerm}
            onChange={handleChange}
          >
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
            <option value="60">60 months</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="residualValue">Residual Value (%)</label>
          <input
            type="number"
            id="residualValue"
            name="residualValue"
            value={formData.residualValue}
            onChange={handleChange}
            required
            min="0"
            max="100"
          />
        </div>

        <button type="submit" className="btn-primary">Calculate Payment</button>
      </form>

      {monthlyPayment > 0 && (
        <div className="result">
          <h3>Estimated Monthly Payment</h3>
          <p className="payment-amount">${monthlyPayment}</p>
          <p className="disclaimer">
            * This is an estimate. Actual payments may vary based on credit score, 
            dealer fees, and other factors.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeasingCalculator; 