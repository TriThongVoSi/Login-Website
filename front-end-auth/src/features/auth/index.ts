/**
 * Auth Feature - Public API
 * 
 * Central export point for the auth feature.
 * Import from '@/features/auth' instead of specific files.
 */

// Context & Provider
export { AuthContext, AuthProvider } from "./context/AuthContext";

// Types
export type {
  AuthContextType,
  LoginResult,
  User,
  UserRole,
} from "./types/auth.types";

// Hooks
export { useAuth } from "./hooks/useAuth";

// Services (for advanced usage)
export {
  initializeAuth,
  normalizeRole,
  performGoogleLogin,
  performLogin,
  performLogout,
} from "./services/authService";
