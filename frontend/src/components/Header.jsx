import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header header-main">
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="logo">
            <img src="/images/logo.svg" alt="D&M Leasing" className="logo__img" />
          </Link>
          <nav className={`menu ${menuOpen ? 'menu--active' : ''}`}>
            <button
              className="menu__btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <ul className="menu__list">
              <li className="menu__list-item">
                <Link to="/new-cars" className="menu__list-link">
                  NEW CARS
                </Link>
              </li>
              <li className="menu__list-item">
                <Link to="/pre-owned" className="menu__list-link">
                  PRE-OWNED CARS
                </Link>
              </li>
              <li className="menu__list-item">
                <Link to="/finance" className="menu__list-link">
                  FINANCE
                </Link>
              </li>
              <li className="menu__list-item">
                <Link to="/lease-vs-buy" className="menu__list-link">
                  LEASE VS BUY
                </Link>
              </li>
              <li className="menu__list-item">
                <Link to="/contacts" className="menu__list-link">
                  CONTACT US
                </Link>
              </li>
              {token ? (
                <>
                  <li className="menu__list-item">
                    <Link to="/dashboard" className="menu__list-link">
                      DASHBOARD
                    </Link>
                  </li>
                  <li className="menu__list-item">
                    <button
                      onClick={handleLogout}
                      className="menu__list-link"
                    >
                      LOGOUT
                    </button>
                  </li>
                </>
              ) : (
                <li className="menu__list-item">
                  <Link to="/login" className="menu__list-link">
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