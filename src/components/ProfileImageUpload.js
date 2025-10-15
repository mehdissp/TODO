import React, { useState, useRef } from 'react';
import { authAPI } from '../services/api';
import './ProfileImageUpload.css';

const ProfileImageUpload = ({ user, onImageUpdate, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // اعتبارسنجی فایل
    if (!file.type.startsWith('image/')) {
      setError('لطفاً یک فایل تصویر انتخاب کنید');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
      return;
    }

    setError('');
    
    // ایجاد پیش‌نمایش
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // آپلود فایل
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await authAPI.uploadProfileImage(
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // موفقیت‌آمیز بود
      setUploading(false);
      setUploadProgress(100);
      
      // اطلاع به کامپوننت والد
      if (onImageUpdate) {
        onImageUpdate(response.data.data || response.data);
      }

      // پاک کردن پیشرفت بعد از 2 ثانیه
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      console.error('خطا در آپلود عکس:', error);
      setError('خطا در آپلود عکس. لطفاً مجدداً تلاش کنید.');
      setUploading(false);
      setUploadProgress(0);
      setPreviewImage(currentImage); // بازگشت به عکس قبلی
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('آیا از حذف عکس پروفایل مطمئن هستید؟')) {
      return;
    }

    try {
      await authAPI.deleteProfileImage();
      
      // اطلاع به کامپوننت والد
      if (onImageUpdate) {
        onImageUpdate({ ...user, profileImagePath: null });
      }
      
      setPreviewImage(null);
      setError('');
    } catch (error) {
      console.error('خطا در حذف عکس:', error);
      setError('خطا در حذف عکس. لطفاً مجدداً تلاش کنید.');
    }
  };

  const getDisplayImage = () => {
    return previewImage || user?.profileImagePath;
  };

  const getUserInitial = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="profile-image-upload">
      <div className="image-container">
        <div 
          className={`profile-image-wrapper ${uploading ? 'uploading' : ''}`}
          onClick={handleImageClick}
          title="برای تغییر عکس کلیک کنید"
        >
          {getDisplayImage() ? (
            <img 
              src={getDisplayImage()} 
              alt="پروفایل" 
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              {getUserInitial()}
            </div>
          )}
          
          {/* overlay برای hover */}
          <div className="image-overlay">
            <span className="camera-icon">📷</span>
            <span className="change-text">تغییر عکس</span>
          </div>

          {/* progress bar */}
          {uploading && (
            <div className="upload-progress">
              <div 
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}
        </div>

        {/* دکمه حذف اگر عکس وجود دارد */}
        {getDisplayImage() && !uploading && (
          <button 
            className="remove-image-btn"
            onClick={handleRemoveImage}
            type="button"
            title="حذف عکس پروفایل"
          >
            ✕
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="file-input"
      />

      {/* نمایش خطا */}
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {/* راهنما */}
      <div className="upload-help">

      </div>
    </div>
  );
};

export default ProfileImageUpload;