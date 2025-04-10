import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeases } from '../store/slices/leasesSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: leases, loading, error } = useSelector((state) => state.leases);

  useEffect(() => {
    dispatch(fetchLeases());
  }, [dispatch]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <section className="dashboard">
      <div className="container">
        <h2 className="dashboard__title">Welcome, {user?.username}!</h2>
        <div className="dashboard__content">
          <div className="dashboard__section">
            <h3 className="dashboard__section-title">Your Leases</h3>
            {leases.length === 0 ? (
              <p className="dashboard__empty">
                You don't have any active leases.{' '}
                <Link to="/new-cars" className="dashboard__link">
                  Browse available cars
                </Link>
              </p>
            ) : (
              <div className="dashboard__leases">
                {leases.map((lease) => (
                  <div key={lease.id} className="dashboard__lease">
                    <div className="dashboard__lease-info">
                      <h4 className="dashboard__lease-title">
                        {lease.car.year} {lease.car.make} {lease.car.model}
                      </h4>
                      <div className="dashboard__lease-details">
                        <div className="dashboard__lease-detail">
                          <span className="dashboard__lease-label">
                            Start Date:
                          </span>
                          <span className="dashboard__lease-value">
                            {new Date(lease.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="dashboard__lease-detail">
                          <span className="dashboard__lease-label">
                            End Date:
                          </span>
                          <span className="dashboard__lease-value">
                            {new Date(lease.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="dashboard__lease-detail">
                          <span className="dashboard__lease-label">
                            Monthly Payment:
                          </span>
                          <span className="dashboard__lease-value">
                            ${lease.monthly_payment}
                          </span>
                        </div>
                        <div className="dashboard__lease-detail">
                          <span className="dashboard__lease-label">Status:</span>
                          <span
                            className={`dashboard__lease-status dashboard__lease-status--${lease.status}`}
                          >
                            {lease.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard__lease-actions">
                      <button className="dashboard__lease-button">
                        View Details
                      </button>
                      {lease.status === 'active' && (
                        <button className="dashboard__lease-button">
                          Make Payment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dashboard__section">
            <h3 className="dashboard__section-title">Your Profile</h3>
            <div className="dashboard__profile">
              <div className="dashboard__profile-info">
                <div className="dashboard__profile-detail">
                  <span className="dashboard__profile-label">Username:</span>
                  <span className="dashboard__profile-value">
                    {user?.username}
                  </span>
                </div>
                <div className="dashboard__profile-detail">
                  <span className="dashboard__profile-label">Email:</span>
                  <span className="dashboard__profile-value">{user?.email}</span>
                </div>
              </div>
              <div className="dashboard__profile-actions">
                <button className="dashboard__profile-button">
                  Edit Profile
                </button>
                <button className="dashboard__profile-button">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard; 