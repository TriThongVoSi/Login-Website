import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Google OAuth2 callback page.
 * Handles the redirect from Google OAuth and processes the auth code.
 * In our GIS flow, authentication is handled client-side via the credential
 * callback. This page serves as the registered redirect URI fallback.
 */
export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleCallback = useCallback(async () => {
    // If already authenticated (GIS callback already handled), redirect
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // Check URL hash for credential (GIS sometimes includes it in the hash)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const credential = hashParams.get("credential");

    if (credential) {
      const result = await loginWithGoogle(credential);
      if (result.success) {
        navigate(result.redirectTo || "/dashboard", { replace: true });
      } else {
        setError(result.error || "Đăng nhập Google thất bại");
      }
    } else {
      // No credential found, redirect to sign-in
      navigate("/sign-in", { replace: true });
    }
  }, [isAuthenticated, loginWithGoogle, navigate]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">
            Đăng nhập Google thất bại
          </h1>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate("/sign-in")}
            className="btn-primary"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-gray-500">Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  );
}
