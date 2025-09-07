import React from 'react';
import { useLiff } from '../contexts/LiffContext';
import { usePageNavigation } from '../hooks/usePageNavigation';
import ProfileCard from '../components/ProfileCard';
const HomePage: React.FC = () => {
  const { message, error, isLoggedIn, login, logout, userProfile } = useLiff();
  
  // ใช้ custom hook สำหรับจัดการ page navigation
  usePageNavigation({
    validPages: ['about'],
    replaceHistory: true
  });

  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the Home page</p>
      
      <div>
        <h2>LIFF Status</h2>
        {message && <p>{message}</p>}
        {error && (
          <p>
            <code>{error}</code>
          </p>
        )}
      </div>

      {userProfile && <ProfileCard userProfile={userProfile} />}

    </div>
  );
};

export default HomePage;