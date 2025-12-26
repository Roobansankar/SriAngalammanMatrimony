// Frontend API configuration
// Centralizes API URL access for consistency across all components

// Base API URL - defaults to relative path for Docker/nginx proxy setup
// In Docker: nginx proxies /api to backend:5000
// For local dev without Docker: set REACT_APP_API_BASE=http://localhost:5000
export const API_BASE = process.env.REACT_APP_API_BASE || "";

// Full API path helper
export const API = `${API_BASE}/api`;

// Socket.io URL - leave empty to use same origin
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || undefined;

// Helper to build API URLs
export const apiUrl = (path) => `${API}${path.startsWith('/') ? path : '/' + path}`;

// Helper to build gallery image URLs
export const galleryUrl = (filename) => {
  if (!filename) return `${API_BASE}/gallery/nophoto.jpg`;
  return `${API_BASE}/gallery/${filename}`;
};

// Helper to build kundli/horoscope file URLs
export const kundliUrl = (filename) => {
  if (!filename) return null;
  return `${API_BASE}/kundli/${filename}`;
};

export default {
  API_BASE,
  API,
  SOCKET_URL,
  apiUrl,
  galleryUrl,
  kundliUrl,
};
