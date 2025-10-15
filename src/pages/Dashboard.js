import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileImageUpload from '../components/ProfileImageUpload';
import './Dashboard.css';

const Dashboard = () => {
  const { user, fetchUserProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    if (!initialLoad) {
      const token = localStorage.getItem('token');
      if (token && !user) {
        fetchUserProfile();
      }
      setInitialLoad(true);
    }
  }, [initialLoad, user, fetchUserProfile]);

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  // تابع برای آپدیت کاربر بعد از تغییر عکس
  const handleImageUpdate = (updatedUser) => {
    fetchUserProfile();
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>داشبورد مدیریت</h1>
        <p>خلاصه‌ای از فعالیت‌های سیستم</p>
      </div>

      {/* کارت پروفایل کاربر */}
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-image-container">
              <ProfileImageUpload 
                user={user}
                onImageUpdate={handleImageUpdate}
                currentImage={user?.profileImagePath}
              />
            </div>
            <div className="profile-info">
              <h2>{user?.username || 'در حال بارگذاری...'}</h2>
              <p>{user?.email || 'در حال بارگذاری...'}</p>
              <div className="profile-actions">
                <button 
                  onClick={handleRefreshProfile} 
                  className="refresh-profile-btn"
                  disabled={refreshing}
                >
                  {refreshing ? '...' : 'بروزرسانی پروفایل'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">وضعیت حساب</span>
              <span className="stat-value active">فعال</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">تاریخ عضویت</span>
              <span className="stat-value">{new Date().toLocaleDateString('fa-IR')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">آخرین ورود</span>
              <span className="stat-value">{new Date().toLocaleString('fa-IR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* آمار و اطلاعات */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-info">
            <h3>آمار بازدید</h3>
            <p>۱,۲۴۵</p>
            <span className="stat-trend positive">+۱۲٪</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success">👥</div>
          <div className="stat-info">
            <h3>کاربران فعال</h3>
            <p>۵۶۷</p>
            <span className="stat-trend positive">+۸٪</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">💰</div>
          <div className="stat-info">
            <h3>فروش امروز</h3>
            <p>۱۲,۳۴۰,۰۰۰ تومان</p>
            <span className="stat-trend positive">+۲۳٪</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon danger">📈</div>
          <div className="stat-info">
            <h3>کارایی سیستم</h3>
            <p>۹۸٪</p>
            <span className="stat-trend positive">+۲٪</span>
          </div>
        </div>
      </div>

      {/* چارت‌ها و اطلاعات بیشتر */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>نمودار فروش ماهانه</h3>
          <div className="chart-placeholder">
            📊 نمودار فروش
          </div>
        </div>
        
        <div className="chart-card">
          <h3>کاربران جدید</h3>
          <div className="chart-placeholder">
            👥 نمودار کاربران
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;