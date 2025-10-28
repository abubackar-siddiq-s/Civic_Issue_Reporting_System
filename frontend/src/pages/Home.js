import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="card text-center hero-section">
        <div className="card-header">
          <h1 className="card-title">Civic Issue Reporting System</h1>
          <p className="subtitle">Government of Jharkhand - Clean & Green Technology Theme</p>
          <p>Empowering citizens to make their communities better through technology</p>
        </div>
        
        <div className="grid grid-3 mt-3">
          <div className="card feature-card">
            <h3>Report an Issue</h3>
            <p>Report civic issues like garbage, streetlights, water problems, road issues, and more.</p>
            <Link to="/report" className="btn btn-primary">
              Report Issue
            </Link>
          </div>
          
          <div className="card feature-card">
            <h3>Admin Access</h3>
            <p>Municipal officials can manage and resolve reported issues.</p>
            <Link to="/admin/login" className="btn btn-primary">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>How It Works</h2>
        <div className="grid grid-2">
          <div>
            <h4>For Citizens:</h4>
            <ol>
              <li>Take a photo of the civic issue</li>
              <li>Provide location details</li>
              <li>Add a description</li>
              <li>Submit your report</li>
              <li>Track the status of your report</li>
            </ol>
          </div>
          
          <div>
            <h4>For Municipal Officials:</h4>
            <ol>
              <li>Login to admin dashboard</li>
              <li>View all reported issues</li>
              <li>Filter by category, location, or priority</li>
              <li>Update issue status</li>
              <li>Assign issues to departments</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Issue Categories</h2>
        <div className="grid grid-3">
          <div className="text-center">
            <h4>Garbage</h4>
            <p>Waste management issues</p>
          </div>
          <div className="text-center">
            <h4>Streetlight</h4>
            <p>Street lighting problems</p>
          </div>
          <div className="text-center">
            <h4>Water</h4>
            <p>Water supply and drainage</p>
          </div>
          <div className="text-center">
            <h4>Road</h4>
            <p>Road maintenance issues</p>
          </div>
          <div className="text-center">
            <h4>Drainage</h4>
            <p>Drainage system problems</p>
          </div>
          <div className="text-center">
            <h4>Other</h4>
            <p>Other civic issues</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card text-center cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Join thousands of citizens who are already using our platform to improve their communities.</p>
        <div className="cta-buttons">
          <Link to="/report" className="btn btn-primary btn-large">
            Report an Issue
          </Link>
          <Link to="/about" className="btn btn-secondary btn-large">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
