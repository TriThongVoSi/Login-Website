import { z } from "zod";

// Profile info schema
export const ProfileInfoSchema = z.object({
  id: z.number().optional(),
  fullName: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  joinedDate: z.string().optional().nullable(),
});

export type ProfileInfo = z.infer<typeof ProfileInfoSchema>;

// Sign-in request
export const AuthSignInRequestSchema = z.object({
  identifier: z.string().optional(),
  email: z.string().optional(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

export type AuthSignInRequest = z.infer<typeof AuthSignInRequestSchema>;

// Sign-in response
export const AuthSignInResponseSchema = z.object({
  result: z.object({
    token: z.string(),
    tokenType: z.string().optional(),
    expiresIn: z.number().optional(),
    userId: z.number().optional(),
    email: z.string().optional(),
    username: z.string().optional(),
    roles: z.array(z.string()).optional(),
    role: z.string().optional(),
    profile: ProfileInfoSchema.optional(),
    redirectTo: z.string().optional(),
  }),
});

export type AuthSignInResponse = z.infer<typeof AuthSignInResponseSchema>;

// Sign-up request
export const AuthSignUpRequestSchema = z.object({
  username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
});

export type AuthSignUpRequest = z.infer<typeof AuthSignUpRequestSchema>;

// Sign-up response
export const AuthSignUpResponseSchema = z.object({
  result: z.object({
    message: z.string(),
    nextStep: z.string().optional().nullable(),
    emailMasked: z.string().optional().nullable(),
    expiresInSeconds: z.number().optional().nullable(),
  }),
});

export type AuthSignUpResponse = z.infer<typeof AuthSignUpResponseSchema>;

// Sign-up verify OTP request
export const AuthSignUpVerifyOtpRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type AuthSignUpVerifyOtpRequest = z.infer<
  typeof AuthSignUpVerifyOtpRequestSchema
>;

// Sign-up verify OTP response
export const AuthSignUpVerifyOtpResponseSchema = z.object({
  result: z.object({
    message: z.string(),
    user: z
      .object({
        id: z.number(),
        username: z.string(),
        email: z.string(),
        fullName: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        status: z.string(),
        role: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
  }),
});

export type AuthSignUpVerifyOtpResponse = z.infer<
  typeof AuthSignUpVerifyOtpResponseSchema
>;

// Forgot password request
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

// Forgot password response (OTP challenge)
export const ForgotPasswordResponseSchema = z.object({
  result: z.object({
    message: z.string(),
    expiresInSeconds: z.number().optional().nullable(),
  }),
});

export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;

// Forgot password verify OTP request
export const ForgotPasswordVerifyOtpRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type ForgotPasswordVerifyOtpRequest = z.infer<
  typeof ForgotPasswordVerifyOtpRequestSchema
>;

// Forgot password verify OTP response
export const ForgotPasswordVerifyOtpResponseSchema = z.object({
  result: z.object({
    tempResetToken: z.string(),
    expiresInSeconds: z.number().optional().nullable(),
  }),
});

export type ForgotPasswordVerifyOtpResponse = z.infer<
  typeof ForgotPasswordVerifyOtpResponseSchema
>;

// Reset password request
export const ResetPasswordRequestSchema = z.object({
  tempResetToken: z.string(),
  newPassword: z.string().min(6),
});

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

// Reset password response
export const ResetPasswordResponseSchema = z.object({
  result: z.object({
    message: z.string(),
  }),
});

export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;

// Me response
export const AuthMeResponseSchema = z.object({
  result: z.object({
    userId: z.number().optional(),
    email: z.string().optional(),
    username: z.string().optional(),
    roles: z.array(z.string()).optional(),
    role: z.string().optional(),
    profile: ProfileInfoSchema.optional(),
    redirectTo: z.string().optional(),
  }),
});

export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>;

// Google auth request
export const GoogleAuthRequestSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
});

export type GoogleAuthRequest = z.infer<typeof GoogleAuthRequestSchema>;

// Google auth response (same structure as sign-in response)
export const GoogleAuthResponseSchema = AuthSignInResponseSchema;

export type GoogleAuthResponse = z.infer<typeof GoogleAuthResponseSchema>;
