import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProcessSection.css';

const ProcessSection = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProcessSteps = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/process-steps/');
        setSteps(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching process steps:', err);
        setError('Failed to load process steps');
        setLoading(false);
      }
    };

    fetchProcessSteps();
  }, []);

  if (loading) return <div className="process-loading">Loading process...</div>;
  if (error) return <div className="process-error">{error}</div>;
  if (!steps.length) return null; // Don't render if no steps

  return (
    <section className="process-section">
      <div className="process-background"></div> {/* For the zig-zag background */}
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <div className="process-steps-container">
          {steps.map((step) => (
            <div key={step.step_number} className="process-step-card">
              <div className="step-number">{String(step.step_number).padStart(2, '0')}</div>
              <div className="step-content">
                {step.icon && <i className={`${step.icon} step-icon`}></i>}
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection; 