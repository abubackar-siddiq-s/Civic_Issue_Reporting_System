import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { issuesAPI } from "../services/api";

const ReportIssue = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    priority: "Medium",
    location: {
      address: "",
      coordinates: null,
    },
    reporterInfo: {
      name: "",
      email: "",
      phone: "",
    },
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Automatically clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          }));
          setMessage("Location captured successfully!");
        },
        () => {
          setError(
            "Unable to get your location. Please enter address manually."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await issuesAPI.createIssue(formData);
      setMessage("Issue reported successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "Other",
        priority: "Medium",
        location: {
          address: "",
          coordinates: null,
        },
        reporterInfo: {
          name: "",
          email: "",
          phone: "",
        },
        images: [],
      });
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map((error) => error.msg)
          .join(", ");
        setError(`Validation errors: ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || "Failed to report issue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Report a Civic Issue</h2>
        <p>
          Help us improve your community by reporting civic issues. Your report
          will be reviewed by municipal authorities and action will be taken
          accordingly.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Issue Title *</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Brief title of the issue"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="Detailed description of the issue"
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="Garbage">Garbage</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Water">Water</option>
              <option value="Road">Road</option>
              <option value="Drainage">Drainage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location Address *</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              name="location.address"
              className="form-control"
              value={formData.location.address}
              onChange={handleInputChange}
              required
              placeholder="Enter the address where the issue is located"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={getCurrentLocation}
            >
              Get Current Location
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Photos (Optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />
          <small>You can upload up to 5 images</small>
        </div>

        <h3>Reporter Information</h3>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input
              type="text"
              name="reporterInfo.name"
              className="form-control"
              value={formData.reporterInfo.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="reporterInfo.email"
              className="form-control"
              value={formData.reporterInfo.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number (Optional)</label>
          <input
            type="tel"
            name="reporterInfo.phone"
            className="form-control"
            value={formData.reporterInfo.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Issue Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
