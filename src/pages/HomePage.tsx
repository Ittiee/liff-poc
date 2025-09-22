import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProfileCard from "../components/ProfileCard";
import LoadingSpinner from "../components/auth/LoadingSpinner";

const HomePage: React.FC = () => {
  const { isLoggedIn, isLoading, user, error } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to LIFF App</h1>
        <p>A professional React authentication demo with LINE LIFF integration</p>
        
        {!isLoggedIn && (
          <div className="cta-section">
            <p>Sign in to access all features and view your profile.</p>
            <Link to="/login" className="cta-button">
              Get Started
            </Link>
          </div>
        )}
      </div>

      <div className="navigation-section">
        <h2>Navigation</h2>
        <div className="nav-buttons">
          <button onClick={() => navigate("/about")} className="nav-button">
            About Page
          </button>
          {isLoggedIn ? (
            <button onClick={() => navigate("/profile")} className="nav-button">
              My Profile
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="nav-button disabled">
              Profile (Login Required)
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-section">
          <h3>System Status</h3>
          <div className="error-message">
            <strong>Error:</strong> {error.message}
          </div>
        </div>
      )}

      {isLoggedIn && user && (
        <div className="profile-section">
          <h2>Your Profile</h2>
          <div className="user-profile-card">
            <div className="profile-header">
              {user.avatar && (
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
              )}
              <div className="profile-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <div className="roles">
                  {user.roles.map(role => (
                    <span key={role} className="role-badge">{role}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .home-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .hero-section {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
        }
        
        .hero-section h1 {
          color: #333;
          margin-bottom: 16px;
          font-size: 2.5rem;
        }
        
        .hero-section p {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 24px;
        }
        
        .cta-section {
          margin-top: 24px;
        }
        
        .cta-button {
          display: inline-block;
          background: #00B900;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .cta-button:hover {
          background: #007700;
        }
        
        .navigation-section,
        .profile-section {
          margin-bottom: 32px;
          padding: 24px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }
        
        .nav-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .nav-button {
          padding: 8px 16px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .nav-button:hover {
          background: #e0e0e0;
        }
        
        .nav-button.disabled {
          background: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }
        
        .nav-button.disabled:hover {
          background: #f5f5f5;
        }
        
        .error-section {
          margin-bottom: 32px;
          padding: 16px;
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
        }
        
        .error-message {
          color: #c62828;
          font-family: monospace;
        }
        
        .user-profile-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #00B900;
        }
        
        .profile-info h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.4rem;
        }
        
        .profile-info p {
          margin: 0 0 12px 0;
          color: #666;
          font-size: 1rem;
        }
        
        .roles {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .role-badge {
          background: #00B900;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
