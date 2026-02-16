/**
 * Auth Context
 * 
 * React context provider for authentication state.
 * Business logic is delegated to authService.ts (SRP).
 * Types are imported from auth.types.ts (SRP).
 */

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Import types from dedicated module
import type {
  AuthContextType,
  LoginResult,
  User,
  UserRole,
} from "../types/auth.types";

// Import service functions
import {
  initializeAuth,
  performGoogleLogin,
  performLogin,
  performLogout,
} from "../services/authService";

// Re-export types for convenience
export type { AuthContextType, LoginResult, User, UserRole };

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Loading component shown while initializing auth.
 */
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Đang tải ứng dụng...</p>
      </div>
    </div>
  );
}

/**
 * Authentication Provider component.
 * Manages auth state and provides login/logout functions.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = await initializeAuth();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Login handler
  const login = useCallback(
    async (
      identifier: string,
      password: string,
      rememberMe: boolean = false,
    ): Promise<LoginResult> => {
      const { result, user: loggedInUser } = await performLogin(
        identifier,
        password,
        rememberMe,
      );

      if (loggedInUser) {
        setUser(loggedInUser);
      }

      return result;
    },
    [],
  );

  // Google login handler
  const loginWithGoogle = useCallback(
    async (idToken: string): Promise<LoginResult> => {
      const { result, user: loggedInUser } = await performGoogleLogin(idToken);

      if (loggedInUser) {
        setUser(loggedInUser);
      }

      return result;
    },
    [],
  );

  // Logout handler
  const logout = useCallback(async () => {
    await performLogout();
    setUser(null);
  }, []);

  // Get user role
  const getUserRole = useCallback((): UserRole | null => {
    return user?.role || null;
  }, [user]);

  // Show loading screen while initializing
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    getUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
