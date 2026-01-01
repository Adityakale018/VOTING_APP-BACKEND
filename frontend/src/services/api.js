import axios from 'axios';

// Get API URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API calls
export const userAPI = {
  signup: (userData) => api.post('/user/signup', userData),
  login: (credentials) => api.post('/user/login', credentials),
  getProfile: () => api.get('/user/profile'),
  changePassword: (passwordData) => api.put('/user/profile/password', passwordData),
};

// Candidate API calls
export const candidateAPI = {
  getAllCandidates: () => api.get('/candidate/candidates'),
  vote: (candidateID) => api.post(`/candidate/vote/${candidateID}`),
  getVoteCount: () => api.get('/candidate/vote/count'),
};

export default api;
