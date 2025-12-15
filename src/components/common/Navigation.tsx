import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRabbitMQ } from '../../contexts/RabbitMQContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useRabbitMQ();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">AI Image Platform</Link>
          <div className="connection-status">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span className="status-text">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <span className="hamburger-icon">☰</span>
        </button>

        <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            to="/upload"
            className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Upload
          </Link>
          <Link
            to="/history"
            className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            History
          </Link>
          <Link
            to="/profile"
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </Link>

          <div className="nav-user">
            <span className="user-name">{user?.username}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
