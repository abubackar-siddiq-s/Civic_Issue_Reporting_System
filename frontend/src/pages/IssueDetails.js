import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { issuesAPI, getImageUrl } from '../services/api';

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await issuesAPI.getIssue(id);
      setIssue(response.data);
    } catch (err) {
      setError('Failed to fetch issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card text-center loading">
        <h2>Loading Issue Details...</h2>
        <p>Please wait while we fetch the issue information...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-danger">
          {error}
        </div>
        <div className="text-center">
          <Link to="/issues" className="btn btn-primary">
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="card text-center">
        <h2>Issue Not Found</h2>
        <p>The issue you're looking for doesn't exist.</p>
        <Link to="/issues" className="btn btn-primary">
          Back to Issues
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{issue.title}</h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {getStatusBadge(issue.status)}
            {getPriorityBadge(issue.priority)}
          </div>
        </div>

        <div className="grid grid-2">
          <div>
            <h3>Issue Details</h3>
            <p><strong>Category:</strong> {issue.category}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Priority:</strong> {issue.priority}</p>
            <p><strong>Reported:</strong> {formatDate(issue.createdAt)}</p>
            {issue.updatedAt !== issue.createdAt && (
              <p><strong>Last Updated:</strong> {formatDate(issue.updatedAt)}</p>
            )}
          </div>

          <div>
            <h3>Location</h3>
            <p><strong>Address:</strong> {issue.location.address}</p>
            {issue.location.coordinates && (
              <p>
                <strong>Coordinates:</strong> {issue.location.coordinates.lat.toFixed(6)}, {issue.location.coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3>Description</h3>
          <p>{issue.description}</p>
        </div>

        {issue.images && issue.images.length > 0 && (
          <div>
            <h3>Photos</h3>
            <div className="image-gallery">
              {issue.images.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image.url)}
                  alt={`Photo ${index + 1}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open(getImageUrl(image.url), '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3>Reporter Information</h3>
          <p><strong>Name:</strong> {issue.reporterInfo.name}</p>
          <p><strong>Email:</strong> {issue.reporterInfo.email}</p>
          {issue.reporterInfo.phone && (
            <p><strong>Phone:</strong> {issue.reporterInfo.phone}</p>
          )}
        </div>

        {issue.assignedTo && (
          <div>
            <h3>Assignment</h3>
            <p><strong>Assigned To:</strong> {issue.assignedTo}</p>
          </div>
        )}

        <div className="text-center mt-3">
          <Link to="/issues" className="btn btn-secondary">
            Back to Issues
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
