import React, { useState, useEffect } from 'react';
import '../styles/Team.css';

const Team = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/employees/');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="team-page">

      <div className="container">
        <div className="team-grid">
          {employees.map((employee) => (
            <div key={employee.id} className="team-member">
              <div className="member-image">
                <img src={employee.image.startsWith('http') ? employee.image : `http://localhost:8000${employee.image}`} alt={employee.name} />
              </div>
              <div className="member-info">
                <h3>{employee.name}</h3>
                <p className="position">{employee.position}</p>
                <p className="description">{employee.description}</p>
                <div className="contact-info">
                  {employee.email && (
                    <a href={`mailto:${employee.email}`} className="contact-link">
                      <i className="fas fa-envelope"></i> Email
                    </a>
                  )}
                  {employee.phone && (
                    <a href={`tel:${employee.phone}`} className="contact-link">
                      <i className="fas fa-phone"></i> Call
                    </a>
                  )}
                  {employee.linkedin_url && (
                    <a href={employee.linkedin_url} target="_blank" rel="noopener noreferrer" className="contact-link">
                      <i className="fab fa-linkedin"></i> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team; 