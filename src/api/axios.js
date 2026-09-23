import axios from 'axios';

// Set VITE_API_URL in the deployment environment (Vercel → Settings →
// Environment Variables). It must include the /api suffix, e.g.
//   https://devhire-api.onrender.com/api
// Falls back to the local backend so `npm run dev` works with no setup.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({ baseURL });

// Attach token automatically if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
