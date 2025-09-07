import React from 'react';
import { useLiff } from '../contexts/LiffContext';
import { usePageNavigation } from '../hooks/usePageNavigation';
const HomePage: React.FC = () => {
  const { message, error, isInitialized } = useLiff();
  
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

      <div style={{ marginTop: '2rem' }}>
        <h2>LINE Profile</h2>
      </div>
    </div>
  );
};

export default HomePage;