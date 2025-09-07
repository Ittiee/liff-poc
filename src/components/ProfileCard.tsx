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
      <div style={{ textAlign: 'center' }}>
        {userProfile.pictureUrl && (
          <img
            src={userProfile.pictureUrl}
            alt={userProfile.displayName}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '3px solid #00B900',
              marginBottom: '1rem'
            }}
          />
        )}
        <h2 style={{ 
          color: '#1a1a1a',
          margin: '0 0 1rem 0',
          fontSize: '1.8rem'
        }}>
          {userProfile.displayName}
        </h2>
        <div style={{
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#666',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.4'
          }}>
            <strong>User ID:</strong> {userProfile.userId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;