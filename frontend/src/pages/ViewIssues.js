import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issuesAPI, getImageUrl } from '../services/api';

const ViewIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 12,
        ...filters
      };
      
      const response = await issuesAPI.getIssues(params);
      setIssues(response.data.issues);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filters, pagination.current]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Submitted': 'status-submitted',
      'In Progress': 'status-in-progress',
      'Resolved': 'status-resolved',
      'Closed': 'status-closed'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
      'Critical': 'priority-critical'
    };
    
    return (
      <span className={`priority-badge ${priorityClasses[priority]}`}>
        {priority}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="card text-center loading">
        <h2>Loading Issues...</h2>
        <p>Please wait while we fetch the latest issues...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Reported Civic Issues</h2>
              <p>Browse and track civic issues in your area</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setLoading(true);
                fetchIssues();
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="mb-3">
          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                name="search"
                className="form-control"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title or description"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Garbage">Garbage</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Water">Water</option>
                <option value="Road">Road</option>
                <option value="Drainage">Drainage</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
      </div>

      {/* Issues Grid */}
      {issues.length === 0 ? (
        <div className="card text-center">
          <h3>No issues found</h3>
          <p>No civic issues match your current filters.</p>
          <Link to="/report" className="btn btn-primary">
            Report an Issue
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {issues.map(issue => (
            <div key={issue._id} className="card">
              <div className="card-header">
                <h3>{issue.title}</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {getStatusBadge(issue.status)}
                  {getPriorityBadge(issue.priority)}
                </div>
              </div>
              
              <p><strong>Category:</strong> {issue.category}</p>
              <p><strong>Location:</strong> {issue.location.address}</p>
              <p><strong>Reported:</strong> {formatDate(issue.createdAt)}</p>
              
              <p>{issue.description.substring(0, 150)}...</p>
              
              {issue.images && issue.images.length > 0 && (
                <div className="image-gallery">
                  {issue.images.slice(0, 2).map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image.url)}
                      alt={`Issue ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              
              <div className="text-center mt-2">
                <Link 
                  to={`/issues/${issue._id}`} 
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="card text-center">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              disabled={pagination.current === 1}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
            >
              Previous
            </button>
            
            <span style={{ padding: '10px' }}>
              Page {pagination.current} of {pagination.pages}
            </span>
            
            <button
              className="btn btn-secondary"
              disabled={pagination.current === pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewIssues;
