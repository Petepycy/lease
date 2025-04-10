import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import NewCars from './pages/NewCars';
import Team from './pages/Team';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="container">
            <nav className="app-nav">
              <Link to="/" className="app-logo">Simplease</Link>
              <div className="app-nav-links">
                <Link to="/">Home</Link>
                <Link to="/new-cars">New Cars</Link>
                <Link to="/team">About Us</Link>
              </div>
              <div className="app-auth-links">
                <Link to="/login" className="btn-primary">Login</Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-cars" element={<NewCars />} />
            <Route path="/team" element={<Team />} />
            {/* Add other routes here */}
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 Simplease. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
