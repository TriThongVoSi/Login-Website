import { authApi } from "@/api/authApi";
import axios from "axios";
import { Leaf, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Step = "REQUEST" | "OTP" | "RESET" | "SUCCESS";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("REQUEST");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tempResetToken, setTempResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiresInSeconds, setExpiresInSeconds] = useState<number | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });
      setExpiresInSeconds(response.result.expiresInSeconds ?? null);
      setStep("OTP");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | { code?: string; message?: string }
          | undefined;
        setError(responseData?.message || "Request failed. Please try again.");
      } else {
        setError("Request failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyForgotPasswordOtp({ email, otp });
      setTempResetToken(response.result.tempResetToken);
      setStep("RESET");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | { code?: string; message?: string }
          | undefined;
        if (responseData?.code === "OTP_INVALID") {
          setError("Invalid OTP");
        } else if (responseData?.code === "OTP_EXPIRED") {
          setError("OTP expired. Please request a new code.");
        } else if (responseData?.code === "OTP_TOO_MANY_ATTEMPTS") {
          setError("Too many attempts. Please request a new code.");
        } else {
          setError(responseData?.message || "Verification failed");
        }
      } else {
        setError("Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ tempResetToken, newPassword });
      setStep("SUCCESS");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | { code?: string; message?: string }
          | undefined;
        if (responseData?.code === "RESET_TOKEN_EXPIRED") {
          setError("Reset token expired. Please request a new code.");
        } else if (responseData?.code === "RESET_TOKEN_INVALID") {
          setError("Invalid reset token. Please request a new code.");
        } else {
          setError(responseData?.message || "Reset failed");
        }
      } else {
        setError("Reset failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await authApi.forgotPassword({ email });
      setExpiresInSeconds(response.result.expiresInSeconds ?? null);
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (step === "SUCCESS") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
        <div className="card text-center max-w-md">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Password updated
          </h2>
          <p className="text-gray-500 mb-4">Redirecting to sign-in...</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
          <p className="text-gray-500 mt-1">
            {step === "REQUEST"
              ? "Request a reset code"
              : step === "OTP"
              ? "Verify OTP"
              : "Set a new password"}
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {step === "REQUEST" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="label">
                  OTP Code
                </label>
                <input
                  id="otp"
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
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Verifying..." : "Verify"}
              </button>
              {expiresInSeconds ? (
                <p className="text-xs text-gray-500 text-center">
                  OTP expires in {Math.ceil(expiresInSeconds / 60)} minutes.
                </p>
              ) : null}
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {step === "RESET" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="label">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
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
