import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout, fetchUserProfile, loading: authLoading } = useAuth();
  const [layoutLoading, setLayoutLoading] = useState(true);
  const location = useLocation();

  // تشخیص دستگاه موبایل
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // دریافت پروفایل کاربر هنگام لود Layout
  useEffect(() => {
    const initializeLayout = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        console.log('🔄 Layout: دریافت پروفایل کاربر');
        await fetchUserProfile();
      }
      setLayoutLoading(false);
    };

    initializeLayout();
  }, [user, fetchUserProfile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'داشبورد' },
    { path: '/users', icon: '👥', label: 'مدیریت کاربران' },
    { path: '/products', icon: '📦', label: 'محصولات' },
    { path: '/orders', icon: '🛒', label: 'سفارشات' },
    { path: '/reports', icon: '📈', label: 'گزارشات' },
    { path: '/settings', icon: '⚙️', label: 'تنظیمات' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // تابع برای گرفتن حرف اول نام کاربری
  const getUserInitial = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // تابع برای نمایش ایمیل یا متن جایگزین
  const getUserEmail = () => {
    if (user?.email) {
      return user.email;
    }
    return 'ایمیل ثبت نشده';
  };

  // تابع برای نمایش نام کاربری یا متن جایگزین
  const getUsername = () => {
    if (user?.username) {
      return user.username;
    }
    return 'کاربر';
  };

  // اگر در حال لودینگ هستیم
  const isLoading = authLoading || layoutLoading;

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            {sidebarOpen ? (
              <h2>🚀 سامانه مدیریت</h2>
            ) : (
              <h2>🚀</h2>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className={`user-info ${isLoading ? 'loading' : ''}`}>
            <div className="user-avatar">
              {isLoading ? (
                <div className="avatar-loading"></div>
              ) : user?.profileImagePath ? (
                <img 
                  src={user.profileImagePath} 
                  alt="پروفایل" 
                  className="profile-avatar-img"
                />
              ) : (
                <span className="avatar-initial">{getUserInitial()}</span>
              )}
            </div>
            {sidebarOpen && (
              <div className="user-details">
                <span className="user-name">
                  {isLoading ? 'در حال بارگذاری...' : getUsername()}
                </span>
                <span className="user-email">
                  {isLoading ? '...' : getUserEmail()}
                </span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} disabled={isLoading}>
            <span className="logout-icon">🚪</span>
            {sidebarOpen && <span>خروج</span>}
          </button>
        </div>

        {/* دکمه بستن در موبایل */}
        {isMobile && (
          <button className="mobile-close-btn" onClick={closeMobileMenu}>
            ✕
          </button>
        )}
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && isMobile && (
        <div 
          className="mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="top-header">
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            ☰
          </button>
          <div className="header-actions">
            <button className="notification-btn">
              🔔
            </button>
            <div className="user-menu">
              {isLoading ? (
                <div className="user-loading-skeleton">
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text long"></div>
                </div>
              ) : (
                <>
                  <span className="welcome-text">سلام، <strong>{getUsername()}</strong></span>
                  {user?.email && (
                    <span className="user-email-small">{user.email}</span>
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        <main className="content" onClick={() => isMobile && mobileMenuOpen && closeMobileMenu()}>
          {/* لودینگ برای محتوا */}
          {isLoading ? (
            <div className="content-loading">
              <div className="loading-spinner-large"></div>
              <p>در حال بارگذاری...</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;