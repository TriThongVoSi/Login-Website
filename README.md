# 🌿 React Login System

Hệ thống đăng nhập React.js với giao diện thiên nhiên (tone màu xanh lá), hỗ trợ phân quyền Admin/User.

## ✨ Tính năng

- 🔐 **Đăng nhập an toàn** với validation
- 👤 **Phân quyền người dùng** (Admin/User)
- 🎨 **Giao diện thiên nhiên** đẹp mắt
- 📱 **Responsive design** hỗ trợ mobile
- 🔄 **Authentication context** quản lý trạng thái
- 🛡️ **Protected routes** bảo vệ route
- ⚡ **Components tái sử dụng**

## 🚀 Cách chạy

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:5173

## 👨‍💼 Tài khoản demo

### Admin
- **Email:** admin@test.com
- **Password:** 123456
- **Role:** Admin

### User  
- **Email:** user@test.com
- **Password:** 123456
- **Role:** User

## 📁 Cấu trúc thư mục

```
src/
│── assets/         # Hình ảnh, font, icon, file tĩnh
│── components/     # Components tái sử dụng
│   ├── Button.jsx       # Button styled
│   ├── Input.jsx        # Input với validation
│   └── RoleSelector.jsx # Chọn quyền admin/user
│── layouts/        # Layout chung 
│── pages/          # Các trang
│   ├── Login.jsx        # Trang đăng nhập
│   ├── AdminDashboard.jsx # Dashboard admin
│   └── UserDashboard.jsx  # Dashboard user
│── hooks/          # Custom hooks
│── contexts/       # React Context
│   └── AuthContext.jsx # Quản lý authentication
│── services/       # API services
│   └── authService.js  # Giả lập API login
│── utils/          # Hàm tiện ích
│   └── validate.js     # Validation functions
│── constants/      # Biến hằng số
│   └── routes.js       # Route constants
│── routes/         # Routing tập trung
│   └── index.jsx       # Router configuration
│── App.jsx         # App chính
└── main.jsx        # Entry point
```

## 🎯 Luồng hoạt động

1. **Truy cập ứng dụng** → Redirect đến `/login`
2. **Đăng nhập thành công:**
   - Admin → `/admin/dashboard`
   - User → `/user/dashboard`  
3. **Chưa đăng nhập** → Redirect đến `/login`
4. **Sai quyền truy cập** → Redirect về dashboard phù hợp

## 🛠️ Công nghệ sử dụng

- **React 19** - UI Framework
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **CSS3** - Styling với gradient thiên nhiên
- **Context API** - State management
- **LocalStorage** - Lưu trữ token

## 🎨 Design System

### Màu sắc chính
- **Primary Green:** #4CAF50
- **Secondary Green:** #66BB6A  
- **Light Green:** #81C784
- **Dark Green:** #1B5E20
- **Background:** Linear gradient xanh nhạt

### Typography
- **Font Family:** System fonts (San Francisco, Segoe UI, Roboto...)
- **Font Weights:** 400, 500, 600, 700

## 📱 Responsive

- **Desktop:** Optimized cho màn hình lớn
- **Tablet:** Responsive layout 768px+
- **Mobile:** Mobile-first design 480px+

## 🔒 Bảo mật

- ✅ Input validation (email, password)
- ✅ Protected routes với role checking
- ✅ Token-based authentication
- ✅ Auto logout khi token hết hạn
- ✅ XSS protection với React

## 🏗️ Scripts

```bash
# Development
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

## 📋 TODO

- [ ] Thêm forgot password
- [ ] Thêm registration form
- [ ] Thêm dark/light theme
- [ ] Thêm i18n (đa ngôn ngữ)
- [ ] Kết nối API thật
- [ ] Thêm testing

---

💚 **Thiết kế với tình yêu thiên nhiên** 🌿