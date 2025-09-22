import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/auth/LoadingSpinner";

const AboutPage: React.FC = () => {
  const { isLoggedIn, isLoading, user, error } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="about-page">
      <div className="content-header">
        <h1>About Our Authentication</h1>
        <p>This page demonstrates professional React authentication patterns</p>
      </div>

      <div className="auth-info">
        <h2>Authentication Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🔐 Protected Routes</h3>
            <p>Some pages (like Profile) require authentication to access. Unauthorized users are redirected to login.</p>
          </div>
          
          <div className="feature-card">
            <h3>🚀 JWT Token Authentication</h3>
            <p>Modern token-based authentication with access/refresh token rotation and secure HttpOnly cookies.</p>
          </div>
          
          <div className="feature-card">
            <h3>⚡ Professional UX</h3>
            <p>Loading states, error handling, and graceful degradation for optimal user experience.</p>
          </div>
          
          <div className="feature-card">
            <h3>🛡️ Security Best Practices</h3>
            <p>Secure token handling, error boundaries, and proper state management.</p>
          </div>
        </div>
      </div>

      {isLoggedIn && user && (
        <div className="user-info">
          <h2>Your Information</h2>
          <div className="user-card">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">{user.name?.charAt(0)}</div>
              )}
            </div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>User ID: {user.id}</p>
              <div className="user-roles">
                <strong>Roles:</strong>
                {user.roles.map(role => (
                  <span key={role} className="role-tag">{role}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-section">
          <h3>System Error</h3>
          <div className="error-details">
            <p><strong>Type:</strong> {error.type}</p>
            <p><strong>Message:</strong> {error.message}</p>
            {error.code && <p><strong>Code:</strong> {error.code}</p>}
          </div>
        </div>
      )}

      <div className="navigation">
        <button onClick={() => navigate("/")} className="nav-button">
          ← Back to Home
        </button>
        {isLoggedIn && (
          <button onClick={() => navigate("/profile")} className="nav-button">
            View Profile →
          </button>
        )}
      </div>

      <style>{`
        .about-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .content-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .content-header h1 {
          color: #333;
          margin-bottom: 16px;
        }
        
        .content-header p {
          color: #666;
          font-size: 1.1rem;
        }
        
        .auth-info {
          margin-bottom: 40px;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .feature-card {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }
        
        .feature-card h3 {
          margin-bottom: 12px;
          color: #00B900;
        }
        
        .user-info {
          margin-bottom: 40px;
          padding: 24px;
          border: 2px solid #00B900;
          border-radius: 12px;
          background: #f0fff0;
        }
        
        .user-card {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 16px;
        }
        
        .user-avatar img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #00B900;
        }
        
        .avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #00B900;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
        }
        
        .user-details h3 {
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .user-details p {
          margin: 4px 0;
          color: #666;
          font-size: 14px;
        }
        
        .user-roles {
          margin: 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .role-tag {
          background: #00B900;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .error-section {
          margin-bottom: 32px;
          padding: 16px;
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
        }
        
        .error-details p {
          margin: 8px 0;
          color: #c62828;
        }
        
        .navigation {
          text-align: center;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .nav-button {
          padding: 10px 20px;
          background: #00B900;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
        }
        
        .nav-button:hover {
          background: #007700;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
