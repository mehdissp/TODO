// // import { useState, useEffect } from 'react';
// // import { authAPI } from '../services/api';

// // export const useAuth = () => {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     checkAuth();
// //   }, []);

// //   const checkAuth = async () => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       setIsAuthenticated(true);
// //       await fetchUserProfile();
// //     } else {
// //       setIsAuthenticated(false);
// //     }
// //     setLoading(false);
// //   };

// //   const fetchUserProfile = async () => {
// //     try {
// //       const response = await authAPI.getProfile();
// //       // فرض می‌کنیم پاسخ به صورت { data: { ... } } هست
// //       setUser(response.data.data || response.data);
// //     } catch (error) {
// //       console.log('خطا در دریافت پروفایل:', error);
// //       if (error.response?.status === 401) {
// //         logout();
// //       }
// //     }
// //   };

// //   const login = async (credentials) => {
// //     try {
// //       const response = await authAPI.login(credentials);
// //       console.log('پاسخ لاگین:', response.data);
      
// //       // هندل کردن ساختارهای مختلف پاسخ
// //       let token, refreshToken;
      
// //       if (response.data.data) {
// //         // ساختار: { data: { token, refreshToken } }
// //         token = response.data.data.token;
// //         refreshToken = response.data.data.refreshToken;
// //       } else {
// //         // ساختار: { token, refreshToken }
// //         token = response.data.token;
// //         refreshToken = response.data.refreshToken;
// //       }
      
// //       if (!token) {
// //         throw new Error('توکن دریافت نشد');
// //       }
      
// //       localStorage.setItem('token', token);
// //       localStorage.setItem('refreshToken', refreshToken);
// //       setIsAuthenticated(true);
      
// //       await fetchUserProfile();
      
// //       return { success: true };
// //     } catch (error) {
// //       console.log('خطا در لاگین:', error);
// //       return { 
// //         success: false, 
// //         error: error.response?.data?.message || error.message || 'خطا در ورود' 
// //       };
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('refreshToken');
// //     setIsAuthenticated(false);
// //     setUser(null);
// //   };

// //   return {
// //     isAuthenticated,
// //     loading,
// //     user,
// //     login,
// //     logout,
// //     checkAuth,
// //     fetchUserProfile
// //   };
// // };
// import { useState, useEffect } from 'react';
// import { authAPI } from '../services/api';

// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);

//   useEffect(() => {
//     checkAuth();
//   }, []); // فقط یک بار هنگام mount صدا زده شود

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//       // فقط اگر user وجود ندارد پروفایل رو بگیر
//       if (!user) {
//         await fetchUserProfile();
//       }
//     } else {
//       setIsAuthenticated(false);
//     }
//     setLoading(false);
//   };

//   const fetchUserProfile = async () => {
//     // اگر در حال حاضر در حال لودینگ هست، صبر کن
//     if (profileLoading) return;
    
//     setProfileLoading(true);
//     try {
//       const response = await authAPI.getProfile();
//       // فرض می‌کنیم پاسخ به صورت { data: { ... } } هست
//       setUser(response.data.data || response.data);
//     } catch (error) {
//       console.log('خطا در دریافت پروفایل:', error);
//       if (error.response?.status === 401) {
//         logout();
//       }
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const login = async (credentials) => {
//     try {
//       const response = await authAPI.login(credentials);
//       console.log('پاسخ لاگین:', response.data);
      
//       // هندل کردن ساختارهای مختلف پاسخ
//       let token, refreshToken;
      
//       if (response.data.data) {
//         // ساختار: { data: { token, refreshToken } }
//         token = response.data.data.token;
//         refreshToken = response.data.data.refreshToken;
//       } else {
//         // ساختار: { token, refreshToken }
//         token = response.data.token;
//         refreshToken = response.data.refreshToken;
//       }
      
//       if (!token) {
//         throw new Error('توکن دریافت نشد');
//       }
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken);
//       setIsAuthenticated(true);
      
//       // بعد از لاگین پروفایل رو بگیر
//       await fetchUserProfile();
      
//       return { success: true };
//     } catch (error) {
//       console.log('خطا در لاگین:', error);
//       return { 
//         success: false, 
//         error: error.response?.data?.message || error.message || 'خطا در ورود' 
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return {
//     isAuthenticated,
//     loading,
//     user,
//     login,
//     logout,
//     checkAuth,
//     fetchUserProfile
//   };
// };



import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  // استفاده از useCallback برای جلوگیری از ایجاد تابع جدید در هر رندر
  const fetchUserProfile = useCallback(async () => {
    // اگر در حال حاضر در حال لودینگ هست یا قبلاً گرفته شده، صبر کن
    if (profileLoading || hasFetchedProfile) {
      console.log('⏸️ پروفایل قبلاً گرفته شده یا در حال لودینگ است');
      return;
    }
    
    setProfileLoading(true);
    try {
      console.log('🔄 در حال دریافت پروفایل...');
      const response = await authAPI.getProfile();
      setUser(response.data.data || response.data);
      setHasFetchedProfile(true); // علامت گذاری که پروفایل گرفته شده
      console.log('✅ پروفایل با موفقیت دریافت شد');
    } catch (error) {
      console.log('❌ خطا در دریافت پروفایل:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setProfileLoading(false);
    }
  }, [profileLoading, hasFetchedProfile]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      let token, refreshToken;
      
      if (response.data.data) {
        token = response.data.data.token;
        refreshToken = response.data.data.refreshToken;
      } else {
        token = response.data.token;
        refreshToken = response.data.refreshToken;
      }
      
      if (!token) {
        throw new Error('توکن دریافت نشد');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);
      
      // بعد از لاگین پروفایل رو بگیر
      await fetchUserProfile();
      
      return { success: true };
    } catch (error) {
      console.log('خطا در لاگین:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'خطا در ورود' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    setHasFetchedProfile(false); // ریست کردن وضعیت
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    checkAuth,
    fetchUserProfile
  };
};