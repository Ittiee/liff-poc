import React from 'react';

interface UserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface ProfileCardProps {
  userProfile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userProfile }) => {
  return (
    <div className="profile-container" style={{
      marginTop: '2rem',
      padding: '2rem',
      borderRadius: '12px',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      margin: '2rem auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {userProfile.pictureUrl && (
          <img
            src={userProfile.pictureUrl}
            alt={userProfile.displayName}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              marginRight: '1.5rem',
              border: '3px solid #00B900'
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            color: '#1a1a1a',
            margin: '0 0 0.5rem 0',
            fontSize: '1.8rem'
          }}>
            {userProfile.displayName}
          </h2>
          <div style={{
            backgroundColor: '#fff',
            padding: '0.8rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}>
            <p style={{ margin: 0, color: '#666' }}>
              <strong>User ID:</strong> {userProfile.userId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;