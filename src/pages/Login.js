import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captchaInput: ''
  });
  const [captcha, setCaptcha] = useState({ 
    id: '', 
    image: '' 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await authAPI.getCaptcha();
      setCaptcha({
        id: response.data.captchaId,
        image: response.data.image
      });
    } catch (error) {
      console.log("خطا در دریافت کپچا:", error);
      setMessage('خطا در دریافت کپچا');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const verifyCaptcha = async () => {
    try {
      const response = await authAPI.verifyCaptcha({
        captchaId: captcha.id,
        userInput: formData.captchaInput
      });
      return response.data.valid;
    } catch (error) {
      setMessage('کپچا نامعتبر است');
      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    // اعتبارسنجی
    const newErrors = {};
    if (!formData.username) newErrors.username = 'نام کاربری الزامی است';
    if (!formData.password) newErrors.password = 'رمز عبور الزامی است';
    if (!formData.captchaInput) newErrors.captchaInput = 'کد کپچا الزامی است';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // بررسی کپچا
      const isCaptchaValid = await verifyCaptcha();
      if (!isCaptchaValid) {
        setMessage('کپچا نامعتبر است');
        fetchCaptcha();
        setLoading(false);
        return;
      }

      // لاگین
      const loginResult = await login({
        username: formData.username,
        password: formData.password
      });

      if (loginResult.success) {
        setMessage('با موفقیت وارد شدید!');
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setMessage(loginResult.error || 'خطا در ورود');
        fetchCaptcha();
      }

    } catch (error) {
      console.log("خطای لاگین:", error);
      setMessage('خطا در ارتباط با سرور');
      fetchCaptcha();
    } finally {
      setLoading(false);
      setFormData(prev => ({ ...prev, captchaInput: '' }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>ورود به سیستم</h2>
        
        {message && (
          <div className={`message ${message.includes('موفق') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>نام کاربری:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              disabled={loading}
              placeholder="نام کاربری خود را وارد کنید"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>رمز عبور:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={loading}
              placeholder="رمز عبور خود را وارد کنید"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="captcha-section">
            <label>کد امنیتی:</label>
            <div className="captcha-container">
              {captcha.image ? (
                <img 
                  src={captcha.image} 
                  alt="captcha" 
                  className="captcha-image"
                  onError={() => setMessage('خطا در نمایش کپچا')}
                />
              ) : (
                <div className="captcha-placeholder">در حال دریافت کپچا...</div>
              )}
              <button 
                type="button" 
                onClick={fetchCaptcha}
                className="refresh-captcha"
                disabled={loading}
                title="دریافت کپچای جدید"
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              name="captchaInput"
              value={formData.captchaInput}
              onChange={handleChange}
              className={errors.captchaInput ? 'error' : ''}
              disabled={loading}
              placeholder="کد نمایش داده شده را وارد کنید"
            />
            {errors.captchaInput && <span className="error-text">{errors.captchaInput}</span>}
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                در حال ورود
                <span className="loading-spinner"></span>
              </>
            ) : (
              'ورود به سیستم'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;