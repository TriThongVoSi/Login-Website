import httpClient from "./http";
import {
  AuthMeResponse,
  AuthMeResponseSchema,
  AuthSignInRequest,
  AuthSignInRequestSchema,
  AuthSignInResponse,
  AuthSignInResponseSchema,
  AuthSignUpRequest,
  AuthSignUpRequestSchema,
  AuthSignUpResponse,
  AuthSignUpResponseSchema,
  AuthSignUpVerifyOtpRequest,
  AuthSignUpVerifyOtpRequestSchema,
  AuthSignUpVerifyOtpResponse,
  AuthSignUpVerifyOtpResponseSchema,
  ForgotPasswordRequest,
  ForgotPasswordRequestSchema,
  ForgotPasswordResponse,
  ForgotPasswordResponseSchema,
  ForgotPasswordVerifyOtpRequest,
  ForgotPasswordVerifyOtpRequestSchema,
  ForgotPasswordVerifyOtpResponse,
  ForgotPasswordVerifyOtpResponseSchema,
  GoogleAuthRequest,
  GoogleAuthRequestSchema,
  GoogleAuthResponse,
  GoogleAuthResponseSchema,
  ResetPasswordRequest,
  ResetPasswordRequestSchema,
  ResetPasswordResponse,
  ResetPasswordResponseSchema,
} from "./schemas";

export const authApi = {
  /**
   * Sign in with username/email and password.
   */
  signIn: async (data: AuthSignInRequest): Promise<AuthSignInResponse> => {
    const payload = {
      identifier: data.identifier || data.email,
      email: data.email || data.identifier,
      password: data.password,
      rememberMe: data.rememberMe ?? false,
    };
    const validatedPayload = AuthSignInRequestSchema.parse(payload);
    const response = await httpClient.post(
      "/api/v1/auth/sign-in",
      validatedPayload,
    );
    return AuthSignInResponseSchema.parse(response.data);
  },

  /**
   * Sign in with Google ID token.
   */
  googleSignIn: async (data: GoogleAuthRequest): Promise<GoogleAuthResponse> => {
    const validatedPayload = GoogleAuthRequestSchema.parse(data);
    const response = await httpClient.post(
      "/api/v1/auth/google",
      validatedPayload,
    );
    return GoogleAuthResponseSchema.parse(response.data);
  },

  /**
   * Register a new user account
   */
  signUp: async (data: AuthSignUpRequest): Promise<AuthSignUpResponse> => {
    const validatedPayload = AuthSignUpRequestSchema.parse(data);
    const response = await httpClient.post(
      "/api/v1/auth/sign-up",
      validatedPayload,
    );
    return AuthSignUpResponseSchema.parse(response.data);
  },

  /**
   * Verify OTP for sign-up
   */
  verifySignUpOtp: async (
    data: AuthSignUpVerifyOtpRequest,
  ): Promise<AuthSignUpVerifyOtpResponse> => {
    const validatedPayload = AuthSignUpVerifyOtpRequestSchema.parse(data);
    const response = await httpClient.post(
      "/api/v1/auth/sign-up/verify-otp",
      validatedPayload,
    );
    return AuthSignUpVerifyOtpResponseSchema.parse(response.data);
  },

  /**
   * Request password reset OTP
   */
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const validatedPayload = ForgotPasswordRequestSchema.parse(data);
    const response = await httpClient.post(
      "/api/v1/auth/forgot-password",
      validatedPayload,
    );
    return ForgotPasswordResponseSchema.parse(response.data);
  },

  /**
   * Verify password reset OTP
   */
  verifyForgotPasswordOtp: async (
    data: ForgotPasswordVerifyOtpRequest,
  ): Promise<ForgotPasswordVerifyOtpResponse> => {
    const validatedPayload = ForgotPasswordVerifyOtpRequestSchema.parse(data);
    const response = await httpClient.post(
      "/api/v1/auth/forgot-password/verify-otp",
      validatedPayload,
    );
    return ForgotPasswordVerifyOtpResponseSchema.parse(response.data);
  },

  /**
   * Reset password with temporary token
   */
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const validatedPayload = ResetPasswordRequestSchema.parse(data);
    const response = await httpClient.post(
      "/api/v1/auth/forgot-password/reset",
      validatedPayload,
    );
    return ResetPasswordResponseSchema.parse(response.data);
  },

  /**
   * Get current authenticated user info
   */
  me: async (): Promise<AuthMeResponse> => {
    const response = await httpClient.get("/api/v1/auth/me");
    return AuthMeResponseSchema.parse(response.data);
  },

  /**
   * Sign out and invalidate the current token
   */
  signOut: async (token: string): Promise<void> => {
    await httpClient.post("/api/v1/auth/sign-out", { token });
  },
};
