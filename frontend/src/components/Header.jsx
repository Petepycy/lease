import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import '../styles/Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="logo">
            <img src="/images/logo.svg" alt="Simplease" className="logo__img" />
          </Link>
          <nav className={`menu ${menuOpen ? 'menu--active' : ''}`}>
            <button
              className="menu__btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <ul className="menu__list">
              <li className="menu__list-item">
                <Link to="/" className="menu__list-link" onClick={() => setMenuOpen(false)}>
                  HOME
                </Link>
              </li>
              <li className="menu__list-item">
                <Link to="/new-cars" className="menu__list-link" onClick={() => setMenuOpen(false)}>
                  NEW CARS
                </Link>
              </li>
              <li className="menu__list-item">
                <Link to="/about" className="menu__list-link" onClick={() => setMenuOpen(false)}>
                  ABOUT US
                </Link>
              </li>
              <li className="menu__list-item">
                <Link to="/contact" className="menu__list-link" onClick={() => setMenuOpen(false)}>
                  CONTACT
                </Link>
              </li>
              {token ? (
                <>
                  <li className="menu__list-item">
                    <Link to="/dashboard" className="menu__list-link" onClick={() => setMenuOpen(false)}>
                      DASHBOARD
                    </Link>
                  </li>
                  <li className="menu__list-item">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="menu__list-link"
                    >
                      LOGOUT
                    </button>
                  </li>
                </>
              ) : (
                <li className="menu__list-item">
                  <Link to="/login" className="menu__list-link login-btn" onClick={() => setMenuOpen(false)}>
                    LOGIN
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 