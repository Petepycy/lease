import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, logoutUser } from './store/slices/authSlice';
import './App.css';
import Home from './pages/Home';
import NewCars from './pages/NewCars';
import CarDetails from './pages/CarDetails';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isHomePage = location.pathname === '/';
  const isContactPage = location.pathname === '/contact';

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <nav className="app-nav">
            <Link to="/" className="app-logo">Simplease</Link>
            <div className="app-nav-links">
              <Link to="/">Home</Link>
              <Link to="/new-cars">New Cars</Link>
              <Link to="/team">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="app-auth-links">
              {isAuthenticated ? (
                <>
                  <span className="user-welcome">Welcome, {user?.username}</span>
                  <button onClick={handleLogout} className="btn-primary">Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn-primary">Login</Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className={`app-main ${!isHomePage ? 'main-content-padded' : ''} ${isContactPage ? 'contact-route-active' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-cars" element={<NewCars />} />
          <Route path="/car-details/:id" element={<CarDetails />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other routes here */}
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Simplease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
