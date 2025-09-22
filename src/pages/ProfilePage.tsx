import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/auth/LoadingSpinner";

const ProfilePage: React.FC = () => {
  const { isLoggedIn, isLoading, user, error } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="profile-error">
        <h2>Access Denied</h2>
        <p>You must be logged in to view your profile.</p>
        <button onClick={() => navigate("/login")} className="login-button">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>View and manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="avatar-section">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
            ) : (
              <div className="avatar-placeholder">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="avatar-info">
              <h2>{user.name}</h2>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <label>User ID</label>
              <span>{user.id}</span>
            </div>
            
            <div className="detail-row">
              <label>Name</label>
              <span>{user.name}</span>
            </div>
            
            <div className="detail-row">
              <label>Email</label>
              <span>{user.email}</span>
            </div>
            
            <div className="detail-row">
              <label>Roles</label>
              <div className="roles-container">
                {user.roles.map(role => (
                  <span key={role} className="role-badge">{role}</span>
                ))}
              </div>
            </div>
            
            <div className="detail-row">
              <label>Account Status</label>
              <span className="status-active">Active</span>
            </div>
          </div>
        </div>

        {user.roles.includes('admin') && (
          <div className="admin-section">
            <h3>🛡️ Admin Features</h3>
            <p>You have administrative privileges in this application.</p>
            <div className="admin-actions">
              <button className="admin-button">View All Users</button>
              <button className="admin-button">System Settings</button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-section">
          <h3>Profile Error</h3>
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
        <button onClick={() => navigate("/about")} className="nav-button">
          About Page
        </button>
      </div>

      <style>{`
        .profile-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .profile-header h1 {
          color: #333;
          margin-bottom: 8px;
        }
        
        .profile-header p {
          color: #666;
          font-size: 1.1rem;
        }
        
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .profile-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          border: 2px solid #00B900;
        }
        
        .avatar-section {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid #00B900;
        }
        
        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #00B900;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
        }
        
        .avatar-info h2 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 2rem;
        }
        
        .user-email {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }
        
        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-row label {
          font-weight: 600;
          color: #333;
          font-size: 1rem;
        }
        
        .detail-row span {
          color: #666;
          font-size: 1rem;
        }
        
        .roles-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .role-badge {
          background: #00B900;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .status-active {
          background: #e8f5e8;
          color: #2e7d32;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .admin-section {
          background: #f0fff0;
          border: 2px solid #4caf50;
          border-radius: 12px;
          padding: 24px;
        }
        
        .admin-section h3 {
          margin: 0 0 12px 0;
          color: #2e7d32;
        }
        
        .admin-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        
        .admin-button {
          background: #4caf50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        
        .admin-button:hover {
          background: #388e3c;
        }
        
        .error-section {
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 16px;
        }
        
        .error-details p {
          margin: 8px 0;
          color: #c62828;
        }
        
        .navigation {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        
        .nav-button {
          padding: 12px 20px;
          background: #00B900;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
          text-decoration: none;
        }
        
        .nav-button:hover {
          background: #007700;
        }
        
        .profile-error {
          text-align: center;
          padding: 60px 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .profile-error h2 {
          color: #333;
          margin-bottom: 16px;
        }
        
        .profile-error p {
          color: #666;
          margin-bottom: 24px;
          font-size: 1.1rem;
        }
        
        .login-button {
          background: #00B900;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .login-button:hover {
          background: #007700;
        }
        
        @media (max-width: 768px) {
          .avatar-section {
            flex-direction: column;
            text-align: center;
          }
          
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .navigation {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
