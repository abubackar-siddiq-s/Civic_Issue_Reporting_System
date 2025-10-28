import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import ViewIssues from './pages/ViewIssues';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import IssueDetails from './pages/IssueDetails';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/issues" element={<ViewIssues />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
