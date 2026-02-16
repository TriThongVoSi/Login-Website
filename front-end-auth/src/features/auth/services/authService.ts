/**
 * Auth Service
 * 
 * Business logic for authentication operations.
 * Separated from context for Single Responsibility Principle.
 */

import { authApi } from "@/api/authApi";
import {
  clearStoredAuth,
  getStoredAuth,
  saveStoredAuth,
} from "@/utils/authStorage";
import axios from "axios";
import type { User, LoginResult } from "../types/auth.types";

/**
 * Normalizes role value from backend.
 * Accepts any role string - fully configurable from database.
 */
export function normalizeRole(value?: string | null): string | null {
  if (!value) return null;
  return value.toLowerCase();
}

/**
 * Initialize authentication from stored data.
 * Returns user if valid auth exists, null otherwise.
 */
export async function initializeAuth(): Promise<User | null> {
  try {
    const stored = getStoredAuth();
    
    if (!stored || stored.expiresAt <= Date.now()) {
      if (stored) clearStoredAuth();
      return null;
    }

    // Token exists and not expired
    let user = stored.user as User | undefined;

    // Try to refresh from /me endpoint
    try {
      const response = await authApi.me();
      const { result } = response;
      const primaryRole = normalizeRole(result.role || result.roles?.[0]);
      
      if (primaryRole) {
        user = {
          id: result.userId,
          username: result.username || "",
          role: primaryRole,
          email: result.email,
          profile: result.profile,
        };
        saveStoredAuth({ ...stored, user });
      }
    } catch {
      console.warn("Failed to refresh user info from /me endpoint");
    }

    return user || null;
  } catch (error) {
    console.error("Failed to load auth from storage:", error);
    clearStoredAuth();
    return null;
  }
}

/**
 * Perform login with credentials.
 */
export async function performLogin(
  identifier: string,
  password: string,
  rememberMe: boolean = false,
): Promise<{ result: LoginResult; user: User | null }> {
  try {
    const response = await authApi.signIn({
      identifier,
      password,
      rememberMe,
    });
    
    const { result } = response;
    const {
      token,
      username,
      roles,
      userId,
      expiresIn,
      role,
      profile,
      redirectTo,
    } = result;

    const primaryRole = normalizeRole(role || roles?.[0]);

    const user: User = {
      id: userId,
      username: username || "",
      role: primaryRole || "user",
      email: identifier.includes("@") ? identifier : undefined,
      profile,
    };

    const expirationMs = (expiresIn ?? 24 * 60 * 60) * 1000;

    saveStoredAuth(
      {
        token,
        expiresAt: Date.now() + expirationMs,
        user,
      },
      rememberMe,
    );

    return {
      result: { success: true, redirectTo: redirectTo || "/dashboard" },
      user,
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      result: handleLoginError(error),
      user: null,
    };
  }
}

/**
 * Perform login with Google ID token.
 */
export async function performGoogleLogin(
  idToken: string,
): Promise<{ result: LoginResult; user: User | null }> {
  try {
    const response = await authApi.googleSignIn({ idToken });
    
    const { result } = response;
    const {
      token,
      username,
      roles,
      userId,
      expiresIn,
      role,
      email,
      profile,
      redirectTo,
    } = result;

    const primaryRole = normalizeRole(role || roles?.[0]);

    const user: User = {
      id: userId,
      username: username || "",
      role: primaryRole || "user",
      email: email,
      profile,
    };

    const expirationMs = (expiresIn ?? 24 * 60 * 60) * 1000;

    saveStoredAuth(
      {
        token,
        expiresAt: Date.now() + expirationMs,
        user,
      },
      true, // Google login always uses localStorage (persistent)
    );

    return {
      result: { success: true, redirectTo: redirectTo || "/dashboard" },
      user,
    };
  } catch (error) {
    console.error("Google login failed:", error);
    return {
      result: handleGoogleLoginError(error),
      user: null,
    };
  }
}

/**
 * Perform logout.
 */
export async function performLogout(): Promise<void> {
  try {
    const stored = getStoredAuth();
    if (stored?.token) {
      await authApi.signOut(stored.token);
    }
  } catch (error) {
    console.warn("Failed to invalidate token on server:", error);
  } finally {
    clearStoredAuth();
  }
}

/**
 * Handle login errors and return appropriate error messages.
 */
function handleLoginError(error: unknown): LoginResult {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 0;
    const responseData = error.response?.data as
      | { code?: string; message?: string }
      | undefined;

    if (!error.response) {
      return { success: false, error: "Không thể kết nối đến máy chủ." };
    }

    if (responseData?.code === "INVALID_CREDENTIALS") {
      return {
        success: false,
        error: "Tài khoản hoặc mật khẩu không đúng.",
      };
    }

    if (responseData?.code === "USER_LOCKED") {
      return { success: false, error: "Tài khoản đã bị khóa." };
    }

    if (responseData?.code === "USER_INACTIVE") {
      return { success: false, error: "Tài khoản chưa được kích hoạt." };
    }

    if (responseData?.code === "USER_PENDING_VERIFICATION") {
      return { success: false, error: "Tài khoản đang chờ xác thực." };
    }

    if (responseData?.code === "ROLE_MISSING") {
      return { success: false, error: "Tài khoản chưa được phân quyền." };
    }

    if (status === 401) {
      return {
        success: false,
        error: "Tài khoản hoặc mật khẩu không đúng.",
      };
    }
  }

  return { success: false, error: "Đã xảy ra lỗi. Vui lòng thử lại." };
}

/**
 * Handle Google login errors and return appropriate error messages.
 */
function handleGoogleLoginError(error: unknown): LoginResult {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { code?: string; message?: string }
      | undefined;

    if (!error.response) {
      return { success: false, error: "Không thể kết nối đến máy chủ." };
    }

    if (responseData?.code === "GOOGLE_AUTH_FAILED") {
      return {
        success: false,
        error: "Xác thực Google thất bại. Vui lòng thử lại.",
      };
    }

    if (responseData?.code === "USER_LOCKED") {
      return { success: false, error: "Tài khoản đã bị khóa." };
    }

    if (responseData?.code === "USER_INACTIVE") {
      return { success: false, error: "Tài khoản chưa được kích hoạt." };
    }

    return {
      success: false,
      error: responseData?.message || "Đăng nhập Google thất bại.",
    };
  }

  return { success: false, error: "Đã xảy ra lỗi. Vui lòng thử lại." };
}
