import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="card text-center hero-section">
        <div className="card-header">
          <h1 className="card-title">About Civic Issue Reporting System</h1>
          <p className="subtitle">Report. Track. Resolve. Together we make our city better.</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="card">
        <div className="grid grid-2">
          <div>
            <h2>Our Mission</h2>
            <p>
              To connect citizens and municipal authorities through a single digital platform,
              making civic issue reporting quick, transparent, and effective.
            </p>
          </div>
          <div>
            <h2>Our Vision</h2>
            <p>
              A cleaner, smarter, and more responsive city — built through active public participation
              and efficient administration.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="card">
        <h2>✨ Key Features</h2>
        <div className="grid grid-3">
          <div className="feature-card">
            <h3>Easy Reporting</h3>
            <p>Submit civic issues with photos, location, and short descriptions.</p>
          </div>
          <div className="feature-card">
            <h3>Live Tracking</h3>
            <p>Track your report’s progress in real-time from submission to resolution.</p>
          </div>
          <div className="feature-card">
            <h3>Admin Dashboard</h3>
            <p>Municipal officials manage, filter, and resolve issues efficiently.</p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card">
        <h2>🛠️ Technology Stack</h2>
        <div className="grid grid-2">
          <div>
            <h3>Frontend</h3>
            <ul className="tech-list">
              <li>React 18 + React Router</li>
              <li>Axios for API communication</li>
              <li>Responsive CSS design</li>
            </ul>
          </div>
          <div>
            <h3>Backend</h3>
            <ul className="tech-list">
              <li>Node.js + Express.js</li>
              <li>MongoDB + Mongoose</li>
              <li>JWT authentication & Cloudinary for media</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <h2>🎁 Why It Matters</h2>
        <div className="grid grid-2">
          <div>
            <h3>For Citizens</h3>
            <ul className="benefits-list">
              <li>✅ Quick and simple reporting</li>
              <li>✅ Real-time updates</li>
              <li>✅ Transparent communication</li>
            </ul>
          </div>
          <div>
            <h3>For Authorities</h3>
            <ul className="benefits-list">
              <li>✅ Centralized management</li>
              <li>✅ Priority-based handling</li>
              <li>✅ Data-driven insights</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card text-center cta-section">
        <h2>Contact Us</h2>
        <p>Email: support@civicissues.gov.in | Helpline: +91 78456 05971</p>
        <p>Municipal Corporation, Jharkhand, India</p>
      </div>

      {/* Call to Action */}
      <div className="card text-center cta-section">
        <h2>Be the Change!</h2>
        <p>Report issues and help make your city cleaner and better.</p>
        <div className="cta-buttons">
          <Link to="/report" className="btn btn-primary btn-large">
            Report an Issue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
