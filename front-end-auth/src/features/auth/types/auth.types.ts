/**
 * Auth Types
 * 
 * Centralized type definitions for authentication.
 * Separated for Single Responsibility Principle.
 */

import type { ProfileInfo } from "@/api/schemas";

/**
 * UserRole is now a dynamic string to support any role from backend.
 * No hardcoded role types - fully configurable from database.
 */
export type UserRole = string;

/**
 * Authenticated user information.
 */
export interface User {
  id?: number;
  username: string;
  role: UserRole;
  email?: string;
  profile?: ProfileInfo;
}

/**
 * Login result from the authentication process.
 */
export interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

/**
 * Authentication context interface.
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    identifier: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<LoginResult>;
  loginWithGoogle: (idToken: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  getUserRole: () => UserRole | null;
}
