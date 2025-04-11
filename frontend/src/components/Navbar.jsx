import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, logoutUser } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Simplease</Link>
      </div>
      <div className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/new-cars">New Cars</Link>
        <Link to="/about-us">About Us</Link>
        <Link to="/contact">Contact</Link>
        {isAuthenticated ? (
          <div className="navbar__user">
            <span>Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="navbar__logout">
              LOGOUT
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar__login">
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 