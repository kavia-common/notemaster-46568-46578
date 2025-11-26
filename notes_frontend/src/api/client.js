import axios from "axios";

/**
 * Axios client configured for the Notes API.
 * It reads base URL from REACT_APP_API_BASE with a safe fallback to http://localhost:3001.
 * Includes basic request/response interceptors for logging and error handling.
 */

// Resolve base URL from env with fallback
const API_BASE =
  process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim().length > 0
    ? process.env.REACT_APP_API_BASE.trim()
    : "http://localhost:3001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
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
  /** Returns the effective API base URL in use by the axios client. */
  return API_BASE;
}

export default api;
