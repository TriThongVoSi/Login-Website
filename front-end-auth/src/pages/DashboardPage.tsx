import { useAuth } from "@/features/auth/hooks/useAuth";
import { Leaf, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">
                Auth Service
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.username || user?.email}</span>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium uppercase">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-primary-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Đây là Dashboard của bạn!
          </h1>

          <p className="text-gray-500 text-lg mb-8">
            Chào mừng{" "}
            <strong>
              {user?.profile?.fullName || user?.username || "bạn"}
            </strong>{" "}
            đã đăng nhập thành công vào hệ thống.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">
              Thông tin tài khoản:
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 text-gray-500">ID:</span>
                <span className="text-gray-900">{user?.id || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Username:</span>
                <span className="text-gray-900">{user?.username || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Email:</span>
                <span className="text-gray-900">
                  {user?.email || user?.profile?.email || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Họ tên:</span>
                <span className="text-gray-900">
                  {user?.profile?.fullName || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Vai trò:</span>
                <span className="text-gray-900 uppercase">
                  {user?.role || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Trạng thái:</span>
                <span className="text-green-600">
                  {user?.profile?.status || "ACTIVE"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary-50 rounded-lg text-sm text-primary-700">
            <strong>✅ Xác thực thành công!</strong>
            <p className="mt-1">
              Token JWT đã được lưu và sử dụng để gọi API bảo mật.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
