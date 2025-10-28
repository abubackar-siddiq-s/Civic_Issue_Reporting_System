import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Store token and admin info
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
      
      // Redirect to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <div className="card-header text-center">
        <h2 className="card-title">Admin Login</h2>
        <p>Municipal Corporation Dashboard Access</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <div className="text-center mt-3">
        <p><strong>Demo Credentials:</strong></p>
        <p>Email: admin@civic.gov</p>
        <p>Password: admin123</p>
      </div>

      <div className="text-center mt-3">
        <a href="/" className="btn btn-secondary">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
