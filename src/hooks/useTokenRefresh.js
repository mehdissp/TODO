import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useTokenRefresh = () => {
  const { manualRefreshToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // بررسی توکن هر 15 دقیقه
    const interval = setInterval(async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token && refreshToken) {
        try {
          // دکد کردن توکن برای بررسی انقضا
          const payload = JSON.parse(atob(token.split('.')[1]));
          const exp = payload.exp * 1000; // تبدیل به میلی‌ثانیه
          const now = Date.now();
          
          // اگر توکن کمتر از 5 دقیقه دیگر منقضی می‌شود، رفرش کن
          if (exp - now < 5 * 60 * 1000) {
            console.log('🔄 توکن در حال انقضا، در حال رفرش...');
            await manualRefreshToken();
          }
        } catch (error) {
          console.error('خطا در بررسی توکن:', error);
        }
      }
    }, 15 * 60 * 1000); // هر 15 دقیقه

    return () => clearInterval(interval);
  }, [isAuthenticated, manualRefreshToken]);
};