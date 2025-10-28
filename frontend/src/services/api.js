import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (adminData) => api.post('/auth/register', adminData),
  getMe: () => api.get('/auth/me'),
};

// Issues API
export const issuesAPI = {
  createIssue: (issueData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(issueData).forEach(key => {
      if (key === 'images') {
        // Handle images separately
        if (issueData.images && issueData.images.length > 0) {
          issueData.images.forEach((image, index) => {
            formData.append('images', image);
          });
        }
      } else if (key === 'location') {
        formData.append('location', JSON.stringify(issueData[key]));
      } else if (key === 'reporterInfo') {
        formData.append('reporterInfo', JSON.stringify(issueData[key]));
      } else {
        formData.append(key, issueData[key]);
      }
    });

    return api.post('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getIssues: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/issues${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getIssue: (id) => api.get(`/issues/${id}`),
  
  searchIssues: (query, limit = 20) => api.get(`/issues/search/${query}?limit=${limit}`),
};

// Admin API
export const adminAPI = {
  getIssues: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/admin/issues${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getIssue: (id) => api.get(`/admin/issues/${id}`),
  
  updateIssue: (id, updateData) => api.put(`/admin/issues/${id}`, updateData),
  
  deleteIssue: (id) => api.delete(`/admin/issues/${id}`),
  
  getDashboard: (period = 30) => api.get(`/admin/dashboard?period=${period}`),
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

export default api;
