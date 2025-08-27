/**
 * Admin Dashboard Page
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__header">
          <div className="dashboard__welcome">
            <h1 className="dashboard__title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <polyline points="17,11 19,13 23,9"/>
              </svg>
              Bảng điều khiển Quản trị viên
            </h1>
            <p className="dashboard__subtitle">
              Chào mừng, <strong>{user?.name}</strong>! Bạn đang đăng nhập với quyền quản trị viên.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="dashboard__logout-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Đăng xuất
          </Button>
        </div>

        <div className="dashboard__content">
        <div className="dashboard__grid">
          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <div className="dashboard__card-icon dashboard__card-icon--users">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Quản lý người dùng</h3>
            </div>
            <p>Thêm, sửa, xóa và quản lý tài khoản người dùng trong hệ thống.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>1,234</strong> người dùng
              </span>
            </div>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <div className="dashboard__card-icon dashboard__card-icon--settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <h3>Cài đặt hệ thống</h3>
            </div>
            <p>Cấu hình các tham số và cài đặt toàn bộ hệ thống.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>12</strong> cài đặt
              </span>
            </div>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <div className="dashboard__card-icon dashboard__card-icon--reports">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3>Báo cáo & Thống kê</h3>
            </div>
            <p>Xem các báo cáo chi tiết và thống kê hoạt động của hệ thống.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>8</strong> báo cáo mới
              </span>
            </div>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <div className="dashboard__card-icon dashboard__card-icon--security">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Bảo mật</h3>
            </div>
            <p>Quản lý quyền truy cập, bảo mật và các chính sách an toàn.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>2</strong> cảnh báo
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard__info">
          <div className="dashboard__user-info">
            <h3>Thông tin tài khoản</h3>
            <div className="dashboard__user-details">
              <div className="dashboard__user-detail">
                <strong>Email:</strong> {user?.email}
              </div>
              <div className="dashboard__user-detail">
                <strong>Tên:</strong> {user?.name}
              </div>
              <div className="dashboard__user-detail">
                <strong>Quyền:</strong> 
                <span className="dashboard__role dashboard__role--admin">
                  Quản trị viên
                </span>
              </div>
              <div className="dashboard__user-detail">
                <strong>ID:</strong> {user?.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
