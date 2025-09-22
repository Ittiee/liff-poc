import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/auth/LoadingSpinner';
import { LoginCredentials } from '../types/auth';

const LoginPage: React.FC = () => {
  const { isLoggedIn, isLoading, error, login, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(returnTo, { replace: true });
    }
  }, [isLoggedIn, navigate, returnTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    clearError();
    
    try {
      await login(credentials, returnTo);
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Logging you in..." />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome to LIFF App</h1>
          <p>Please sign in with your LINE account to continue</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error.message}</p>
            {error.retryable && (
              <button onClick={clearError} className="dismiss-button">
                Dismiss
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="user@example.com or admin@example.com"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="password123 or admin123"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit"
            className="login-button"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <div className="credentials-list">
            <div>👤 User: user@example.com / password123</div>
            <div>👨‍💼 Admin: admin@example.com / admin123</div>
          </div>
        </div>

        {returnTo !== '/' && (
          <div className="return-notice">
            <p>You'll be redirected to your intended page after signing in.</p>
          </div>
        )}
      </div>

      <style>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        
        .login-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
          padding: 40px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        
        .login-header h1 {
          color: #333;
          margin-bottom: 8px;
          font-size: 24px;
        }
        
        .login-header p {
          color: #666;
          margin-bottom: 30px;
          line-height: 1.5;
        }
        
        .error-message {
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #c62828;
        }
        
        .dismiss-button {
          background: none;
          border: none;
          color: #c62828;
          text-decoration: underline;
          cursor: pointer;
          margin-top: 8px;
          font-size: 14px;
        }
        
        .login-form {
          width: 100%;
        }
        
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
        }
        
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #00B900;
        }
        
        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        
        .login-button {
          background: #00B900;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
          margin-top: 10px;
        }
        
        .login-button:hover:not(:disabled) {
          background: #007700;
        }
        
        .login-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .demo-credentials {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: left;
        }
        
        .demo-credentials h4 {
          margin: 0 0 12px 0;
          color: #495057;
          font-size: 14px;
        }
        
        .credentials-list {
          font-size: 13px;
          color: #6c757d;
          line-height: 1.6;
        }
        
        .credentials-list div {
          margin-bottom: 4px;
        }
        
        .return-notice {
          margin-top: 20px;
          padding: 12px;
          background: #e3f2fd;
          border-radius: 8px;
          font-size: 14px;
          color: #1565c0;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;