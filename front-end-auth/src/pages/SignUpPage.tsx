import { authApi } from "@/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import axios from "axios";
import { CheckCircle2, Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Step = "FORM" | "OTP" | "SUCCESS";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    role: "" as "" | "USER" | "ADMIN",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("FORM");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpInfo, setOtpInfo] = useState<{
    expiresInSeconds?: number | null;
    emailMasked?: string | null;
  }>({});
  const [countdown, setCountdown] = useState(3);

  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Handle Google credential response
  const handleGoogleResponse = useCallback(
    async (response: google.accounts.id.CredentialResponse) => {
      setError("");
      setIsLoading(true);

      const result = await loginWithGoogle(response.credential);

      setIsLoading(false);

      if (result.success) {
        navigate(result.redirectTo || "/dashboard");
      } else {
        setError(result.error || "Đăng ký bằng Google thất bại");
      }
    },
    [loginWithGoogle, navigate],
  );

  // Initialize Google Identity Services
  useEffect(() => {
    if (step !== "FORM") return;

    const initializeGoogleSignIn = () => {
      if (typeof google === "undefined" || !google.accounts) {
        setTimeout(initializeGoogleSignIn, 200);
        return;
      }

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "signup",
      });

      if (googleButtonRef.current) {
        google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "signup_with",
          shape: "rectangular",
          width: "100%",
        });
      }
    };

    initializeGoogleSignIn();
  }, [handleGoogleResponse, step]);

  useEffect(() => {
    if (step !== "SUCCESS") return;
    if (countdown <= 0) {
      navigate("/sign-in");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, countdown, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        phone: formData.phone || undefined,
        role: formData.role,
      });

      setOtpInfo({
        expiresInSeconds: response.result.expiresInSeconds,
        emailMasked: response.result.emailMasked,
      });
      setStep("OTP");
    } catch (err) {
      console.error("Sign-up failed:", err);

      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | { code?: string; message?: string }
          | undefined;

        if (responseData?.code === "EMAIL_ALREADY_EXISTS") {
          setError("Email already in use");
        } else if (responseData?.code === "USERNAME_ALREADY_EXISTS") {
          setError("Username already in use");
        } else if (responseData?.code === "OTP_RESEND_TOO_SOON") {
          setError("OTP was sent recently. Please wait a moment.");
        } else {
          setError(
            responseData?.message || "Sign-up failed. Please try again.",
          );
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!/^[0-9]{6}$/.test(otp)) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setOtpLoading(true);
    try {
      await authApi.verifySignUpOtp({
        email: formData.email,
        otp,
      });

      setStep("SUCCESS");
      setCountdown(3);
    } catch (err) {
      console.error("OTP verification failed:", err);
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | { code?: string; message?: string }
          | undefined;
        if (responseData?.code === "OTP_INVALID") {
          setOtpError("Invalid OTP");
        } else if (responseData?.code === "OTP_EXPIRED") {
          setOtpError("OTP expired. Please request a new code.");
        } else if (responseData?.code === "OTP_TOO_MANY_ATTEMPTS") {
          setOtpError("Too many attempts. Please request a new code.");
        } else {
          setOtpError(responseData?.message || "Verification failed");
        }
      } else {
        setOtpError("Verification failed");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setIsLoading(true);
    try {
      const response = await authApi.signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        phone: formData.phone || undefined,
        role: formData.role,
      });
      setOtpInfo({
        expiresInSeconds: response.result.expiresInSeconds,
        emailMasked: response.result.emailMasked,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | { code?: string; message?: string }
          | undefined;
        if (responseData?.code === "OTP_RESEND_TOO_SOON") {
          setOtpError("OTP was sent recently. Please wait a moment.");
        } else {
          setOtpError(responseData?.message || "Failed to resend OTP");
        }
      } else {
        setOtpError("Failed to resend OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const successPopup = step === "SUCCESS" && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-[scaleIn_0.3s_ease-out]">
        {/* Animated checkmark */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-[bounceIn_0.5s_ease-out]">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-500 mb-6">
          Your account has been created and verified successfully.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to sign-in in {countdown}s...</span>
        </div>
        <button
          onClick={() => navigate("/sign-in")}
          className="btn-primary w-full mt-5"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );

  if (step === "OTP" || step === "SUCCESS") {
    return (
      <>
      {successPopup}
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
            <p className="text-gray-500 mt-1">
              Enter the 6-digit code sent to {otpInfo.emailMasked || formData.email}
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {otpError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {otpError}
                </div>
              )}

              <div>
                <label htmlFor="otp" className="label">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {otpLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {otpLoading ? "Verifying..." : "Verify"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              {otpInfo.expiresInSeconds ? (
                <p>OTP expires in {Math.ceil(otpInfo.expiresInSeconds / 60)} minutes.</p>
              ) : null}
            </div>

            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-primary-600 hover:text-primary-700 font-medium"
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Sign up to get started</p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email - Required */}
            <div>
              <label htmlFor="email" className="label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>

            {/* Username - Required */}
            <div>
              <label htmlFor="username" className="label">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="input-field"
                required
              />
            </div>

            {/* Password - Required */}
            <div>
              <label htmlFor="password" className="label">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min 6 chars)"
                  className="input-field pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm password - Required */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="input-field"
                required
              />
            </div>

            {/* Full name - Optional */}
            <div>
              <label htmlFor="fullName" className="label">
                Full name <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="input-field"
              />
            </div>

            {/* Phone - Optional */}
            <div>
              <label htmlFor="phone" className="label">
                Phone <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className="input-field"
              />
            </div>

            {/* Role selection - Required */}
            <div className="pt-2">
              <label className="label">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    checked={formData.role === "USER"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">USER</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={formData.role === "ADMIN"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">ADMIN</span>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-with-text my-6">
            <span>hoặc</span>
          </div>

          {/* Google Sign-Up Button */}
          <div className="google-btn-container">
            <div ref={googleButtonRef} className="flex justify-center" />
          </div>

          {/* Sign in link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
