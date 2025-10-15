// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://localhost:7178/api',
// });

// // اضافه کردن توکن به هدر درخواست‌ها
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // هندل کردن خطاهای 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // export const authAPI = {
// //   login: (credentials) => api.post('/Auth/login', credentials),
// //   refreshToken: (refreshToken) => api.post('/Auth/refresh', { refreshToken }),
// //   getProfile: () => api.get('/Auth/profile'),
// //   getCaptcha: () => api.get('/Auth/captcha'),
// //   verifyCaptcha: (data) => api.post('/Auth/verify-captcha', data),
// // };

// export const authAPI = {
//   login: (credentials) => api.post('/Auth/login', credentials),
//   refreshToken: (refreshToken) => api.post('/Auth/refresh', { refreshToken }),
//   getProfile: () => {
//     console.log('🔄 API Call: getProfile');
//     return api.get('/Auth/profile');
//   },
//   getCaptcha: () => api.get('/Auth/captcha'),
//   verifyCaptcha: (data) => api.post('/Auth/verify-captcha', data),
// };

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7178/api',
  timeout: 10000,
});

// اضافه کردن توکن به هدر درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// هندل کردن خطاهای 401
api.interceptors.response.use(
  (response) => {
    // بازگرداندن مستقیم data اگر status 200 باشد
    if (response.status === 200 && response.data.status === 200) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // لاگین
  login: (credentials) => api.post('/Auth/login', credentials),
  
  // رفرش توکن
  refreshToken: (refreshToken) => api.post('/Auth/refresh', { refreshToken }),
  
  // گرفتن پروفایل کاربر
  getProfile: () => api.get('/Auth/profile'),
  
  // آپدیت پروفایل کاربر
  updateProfile: (profileData) => api.put('/Auth/profile', profileData),

    // گرفتن منوها از سرور
  getMenus: () => api.get('/Auth/GetMenusForUi'),
  
  // آپلود عکس پروفایل
  uploadProfileImage: (formData, onUploadProgress) => {
    return api.post('/Auth/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(progress);
        }
      },
      timeout: 30000, // 30 ثانیه برای آپلود عکس
    });
  },

  // حذف عکس پروفایل
  deleteProfileImage: () => api.delete('/Auth/profile-image'),
  
  // تغییر رمز عبور
  changePassword: (passwordData) => api.post('/Auth/change-password', passwordData),
  
  // گرفتن کپچا
  getCaptcha: () => api.get('/Auth/captcha'),
  
  // بررسی کپچا
  verifyCaptcha: (data) => api.post('/Auth/verify-captcha', data),
  
  // لاگاوت
  logout: () => api.post('/Auth/logout'),
};

export const userAPI = {
  getUsers: (params) => api.get('/Users', { params }),
  getUserById: (id) => api.get(`/Users/${id}`),
  createUser: (data) => api.post('/Users', data),
  updateUser: (id, data) => api.put(`/Users/${id}`, data),
  deleteUser: (id) => api.delete(`/Users/${id}`),
};

export const productAPI = {
  getProducts: (params) => api.get('/Products', { params }),
  getProductById: (id) => api.get(`/Products/${id}`),
  createProduct: (data) => api.post('/Products', data),
  updateProduct: (id, data) => api.put(`/Products/${id}`, data),
  deleteProduct: (id) => api.delete(`/Products/${id}`),
  uploadProductImage: (formData) => api.post('/Products/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const orderAPI = {
  getOrders: (params) => api.get('/Orders', { params }),
  getOrderById: (id) => api.get(`/Orders/${id}`),
  createOrder: (data) => api.post('/Orders', data),
  updateOrder: (id, data) => api.put(`/Orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/Orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/Orders/${id}/status`, { status }),
};

// API برای آپلود فایل‌های عمومی
export const uploadAPI = {
  uploadFile: (formData, onUploadProgress) => {
    return api.post('/Upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(progress);
        }
      },
    });
  },
  
  deleteFile: (filePath) => api.delete('/Upload', { data: { filePath } }),
};

// تابع برای بررسی اتصال به سرور
export const checkServerHealth = () => api.get('/Health');

// تابع برای هندل کردن خطاها
export const handleApiError = (error) => {
  if (error.response) {
    // سرور پاسخ داده اما با status code اشتباه
    const message = error.response.data?.message || 'خطا در ارتباط با سرور';
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return { message: 'درخواست نامعتبر', status };
      case 401:
        return { message: 'دسترسی غیرمجاز', status };
      case 403:
        return { message: 'شما مجوز دسترسی به این بخش را ندارید', status };
      case 404:
        return { message: 'منبع مورد نظر یافت نشد', status };
      case 429:
        return { message: 'تعداد درخواست‌ها بیش از حد مجاز است', status };
      case 500:
        return { message: 'خطای داخلی سرور', status };
      default:
        return { message, status };
    }
  } else if (error.request) {
    // درخواست ارسال شده اما پاسخی دریافت نشده
    return { message: 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.', status: 0 };
  } else {
    // خطای دیگر
    return { message: 'خطای ناشناخته', status: -1 };
  }
};

export default api;