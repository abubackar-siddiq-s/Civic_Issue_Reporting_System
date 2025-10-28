import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/');
    window.location.reload(); // Force refresh to update navbar state
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand">
            Civic Issue Reporting System
          </Link>

          <ul className="navbar-nav">
            {/* Common Links */}
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>

            {isAdmin ? (
              <>
                <li>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </li>
                <li>
                  <Link to="/issues">View Issues</Link>
                </li>
                <li>
                  <button 
                    className="btn logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/report">Report Issue</Link>
                </li>
                <li>
                  <Link to="/admin/login">Admin Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;