/**
 * Auth Storage Utilities
 * 
 * Handles persistent storage of authentication session data.
 * Extracted from http.ts for Single Responsibility Principle.
 * 
 * This module can be easily swapped for different storage strategies:
 * - localStorage/sessionStorage (current)
 * - cookies
 * - IndexedDB
 * - Custom storage backend
 */

const AUTH_STORAGE_KEY = "auth_session";

export interface StoredAuth {
  token: string;
  expiresAt: number;
  user?: {
    id?: number;
    username: string;
    role: string;
    email?: string;
  };
}

/**
 * Retrieve stored authentication data from browser storage.
 * Checks both localStorage and sessionStorage.
 */
export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      window.localStorage.getItem(AUTH_STORAGE_KEY) ||
      window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

/**
 * Save authentication data to browser storage.
 * @param data - Auth data to store
 * @param rememberMe - If true, uses localStorage (persistent). If false, uses sessionStorage (session only).
 */
export function saveStoredAuth(data: StoredAuth, rememberMe: boolean = true) {
  if (typeof window === "undefined") return;
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  // Clear both storages first to avoid conflicts
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Clear all stored authentication data from browser storage.
 * Used during logout.
 */
export function clearStoredAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Check if the stored auth token is still valid (not expired).
 */
export function isAuthValid(): boolean {
  const stored = getStoredAuth();
  if (!stored) return false;
  return stored.expiresAt > Date.now();
}

/**
 * Get the stored auth token if valid.
 */
export function getValidToken(): string | null {
  const stored = getStoredAuth();
  if (!stored || stored.expiresAt <= Date.now()) return null;
  return stored.token;
}
