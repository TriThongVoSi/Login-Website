/**
 * HTTP Client Configuration
 * 
 * Pure HTTP client setup with interceptors.
 * Storage concerns are delegated to authStorage.ts (SRP).
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  clearStoredAuth,
  getStoredAuth,
  saveStoredAuth,
  type StoredAuth,
} from "@/utils/authStorage";

// Re-export storage functions for backward compatibility
export { clearStoredAuth, getStoredAuth, saveStoredAuth, type StoredAuth };

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add JWT token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const stored = getStoredAuth();

    if (stored?.token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${stored.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      clearStoredAuth();
      if (window.location.pathname !== "/sign-in") {
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  },
);

export default httpClient;
