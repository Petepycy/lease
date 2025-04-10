import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    const result = await dispatch(login(formData));
    if (!result.error) {
      navigate('/dashboard');
    }
  };

  return (
    <section className="login">
      <div className="container">
        <div className="login__inner">
          <h2 className="login__title">Login</h2>
          {error && <div className="login__error">{error}</div>}
          <form onSubmit={handleSubmit} className="login__form">
            <div className="login__form-group">
              <label htmlFor="username" className="login__label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="login__input"
                required
              />
            </div>
            <div className="login__form-group">
              <label htmlFor="password" className="login__label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login__input"
                required
              />
            </div>
            <button
              type="submit"
              className="login__button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="login__text">
            Don't have an account?{' '}
            <Link to="/register" className="login__link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login; 