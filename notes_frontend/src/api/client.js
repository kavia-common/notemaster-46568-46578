import axios from "axios";

/**
 * Axios client configured for the Notes API.
 * Reads base origin from REACT_APP_API_BASE with a safe fallback to http://localhost:3001.
 * All requests are made under the /api namespace to match FastAPI routes.
 * Example final URLs:
 *  - GET  {BASE_ORIGIN}/api/notes
 *  - POST {BASE_ORIGIN}/api/notes
 *  - PUT  {BASE_ORIGIN}/api/notes/{id}
 *  - DEL  {BASE_ORIGIN}/api/notes/{id}
 */

// Resolve base origin from env with fallback
const API_ORIGIN =
  process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim().length > 0
    ? process.env.REACT_APP_API_BASE.trim()
    : "http://localhost:3001";

// Create axios instance with /api prefix to align with backend openapi
const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Interceptors for simple logging (can be extended)
api.interceptors.request.use(
  (config) => {
    // Attach any auth tokens here if needed in the future
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize network or backend errors
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error";
    return Promise.reject(new Error(message));
  }
);

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the effective API base origin in use by the axios client. */
  return API_ORIGIN;
}

export default api;
