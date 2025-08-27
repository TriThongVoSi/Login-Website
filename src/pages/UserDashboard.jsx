/**
 * User Dashboard Page
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import './Dashboard.css';

const UserDashboard = () => {
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Bảng điều khiển Người dùng
            </h1>
            <p className="dashboard__subtitle">
              Chào mừng, <strong>{user?.name}</strong>! Bạn đang đăng nhập với quyền người dùng.
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
              <div className="dashboard__card-icon dashboard__card-icon--profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3>Hồ sơ cá nhân</h3>
            </div>
            <p>Cập nhật thông tin cá nhân và cài đặt tài khoản của bạn.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>95%</strong> hoàn thành
              </span>
            </div>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <div className="dashboard__card-icon dashboard__card-icon--tasks">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3 8-8"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.59 0 3.08.41 4.36 1.14"/>
                </svg>
              </div>
              <h3>Công việc của tôi</h3>
            </div>
            <p>Quản lý và theo dõi các công việc được giao cho bạn.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>7</strong> công việc đang làm
              </span>
            </div>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <div className="dashboard__card-icon dashboard__card-icon--documents">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3>Tài liệu</h3>
            </div>
            <p>Truy cập các tài liệu, hướng dẫn và tệp tin liên quan.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>23</strong> tài liệu
              </span>
            </div>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-header">
              <div className="dashboard__card-icon dashboard__card-icon--notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <h3>Thông báo</h3>
            </div>
            <p>Xem các thông báo và tin tức mới nhất từ hệ thống.</p>
            <div className="dashboard__card-stats">
              <span className="dashboard__stat">
                <strong>3</strong> thông báo mới
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
                <span className="dashboard__role dashboard__role--user">
                  Người dùng
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

export default UserDashboard;
