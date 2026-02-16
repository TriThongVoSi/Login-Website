import { useAuth } from "@/features/auth/hooks/useAuth";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        setError(result.error || "Đăng nhập Google thất bại");
      }
    },
    [loginWithGoogle, navigate],
  );

  // Initialize Google Identity Services
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (typeof google === "undefined" || !google.accounts) {
        // Retry if GIS script hasn't loaded yet
        setTimeout(initializeGoogleSignIn, 200);
        return;
      }

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleButtonRef.current) {
        google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "signin_with",
          shape: "rectangular",
          width: "100%",
        });
      }
    };

    initializeGoogleSignIn();
  }, [handleGoogleResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(identifier, password, rememberMe);

    setIsLoading(false);

    if (result.success) {
      navigate(result.redirectTo || "/dashboard");
    } else {
      setError(result.error || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tên web của bạn</h1>
          <p className="text-gray-500 mt-1">Đăng nhập để tiếp tục</p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Identifier field */}
            <div>
              <label htmlFor="identifier" className="label">
                Email hoặc Tên đăng nhập
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Nhập email hoặc tên đăng nhập"
                className="input-field"
                required
                autoComplete="username"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="label">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="input-field pr-10"
                  required
                  autoComplete="current-password"
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

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="divider-with-text my-6">
            <span>hoặc</span>
          </div>

          {/* Google Sign-In Button */}
          <div className="google-btn-container">
            <div ref={googleButtonRef} className="flex justify-center" />
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/sign-up"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Test credentials */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-2">Tài khoản test:</p>
          <p>
            Email:{" "}
            <code className="bg-white px-1 rounded">user2@acm.local</code>
          </p>
          <p>
            Mật khẩu: <code className="bg-white px-1 rounded">12345678</code>
          </p>
        </div>
      </div>
    </div>
  );
}
