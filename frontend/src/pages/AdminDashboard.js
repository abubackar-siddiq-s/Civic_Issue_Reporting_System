import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    assignedTo: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to fetch dashboard data');
    }
  };

  const fetchIssues = async () => {
    try {
      const params = {
        page: pagination.current,
        limit: 20,
        ...filters
      };
      
      const response = await adminAPI.getIssues(params);
      setIssues(response.data.issues);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch issues');
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        await Promise.all([fetchDashboardData(), fetchIssues()]);
      } catch (err) {
        console.error('Dashboard load error:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, pagination.current]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      await adminAPI.updateIssue(issueId, { status: newStatus });
      fetchIssues(); // Refresh the list
      fetchDashboardData(); // Refresh dashboard stats
    } catch (err) {
      setError('Failed to update issue status');
    }
  };

  const handleAssignmentUpdate = async (issueId, assignedTo) => {
    try {
      await adminAPI.updateIssue(issueId, { assignedTo });
      fetchIssues(); // Refresh the list
    } catch (err) {
      setError('Failed to update assignment');
    }
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
        <h2>Loading Dashboard...</h2>
        <p>Please wait while we fetch the latest data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="card-title">Admin Dashboard</h1>
              <p>Municipal Corporation Issue Management System</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Dashboard Statistics */}
        {dashboardData && (
          <div className="grid grid-3">
            <div className="card text-center">
              <h3>{dashboardData.totalIssues}</h3>
              <p>Total Issues</p>
            </div>
            <div className="card text-center">
              <h3>{dashboardData.recentIssues}</h3>
              <p>Issues (Last 30 Days)</p>
            </div>
            <div className="card text-center">
              <h3>
                {dashboardData.statusStats.find(s => s._id === 'Resolved')?.count || 0}
              </h3>
              <p>Resolved Issues</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card">
          <h3>Filter Issues</h3>
          <div className="grid grid-4">
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

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-control"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                className="form-control"
                value={filters.assignedTo}
                onChange={handleFilterChange}
                placeholder="Filter by assignment"
              />
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="card">
          <h3>Issues Management</h3>

          {issues.length === 0 ? (
            <p>No issues found matching your filters.</p>
          ) : (
            <div className="grid grid-1">
              {issues.map(issue => (
                <div key={issue._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4>{issue.title}</h4>
                      <p><strong>Category:</strong> {issue.category}</p>
                      <p><strong>Location:</strong> {issue.location.address}</p>
                      <p><strong>Reporter:</strong> {issue.reporterInfo.name}</p>
                      <p><strong>Reported:</strong> {formatDate(issue.createdAt)}</p>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        {getStatusBadge(issue.status)}
                        {getPriorityBadge(issue.priority)}
                      </div>

                      <p style={{ marginTop: '10px' }}>
                        {issue.description.substring(0, 200)}...
                      </p>
                    </div>

                    <div style={{ marginLeft: '20px', minWidth: '200px' }}>
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                          className="form-control"
                          value={issue.status}
                          onChange={(e) => handleStatusUpdate(issue._id, e.target.value)}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Assign To</label>
                        <input
                          type="text"
                          className="form-control"
                          value={issue.assignedTo || ''}
                          onChange={(e) => handleAssignmentUpdate(issue._id, e.target.value)}
                          placeholder="Department/Person"
                        />
                      </div>

                      <div className="text-center">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="text-center mt-3">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
