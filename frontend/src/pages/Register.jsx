import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert('Passwords do not match');
      return;
    }
    const result = await dispatch(register(formData));
    if (!result.error) {
      navigate('/login');
    }
  };

  return (
    <section className="register">
      <div className="container">
        <div className="register__inner">
          <h2 className="register__title">Register</h2>
          {error && <div className="register__error">{error}</div>}
          <form onSubmit={handleSubmit} className="register__form">
            <div className="register__form-group">
              <label htmlFor="username" className="register__label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="register__input"
                required
              />
            </div>
            <div className="register__form-group">
              <label htmlFor="email" className="register__label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="register__input"
                required
              />
            </div>
            <div className="register__form-group">
              <label htmlFor="password" className="register__label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="register__input"
                required
              />
            </div>
            <div className="register__form-group">
              <label htmlFor="password2" className="register__label">
                Confirm Password
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="register__input"
                required
              />
            </div>
            <button
              type="submit"
              className="register__button"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="register__text">
            Already have an account?{' '}
            <Link to="/login" className="register__link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register; 