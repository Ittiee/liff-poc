import React from 'react';
import { useLiff } from '../contexts/LiffContext';

const AboutPage: React.FC = () => {
  const { message, error, isInitialized } = useLiff();

  return (
    <div>
      <h1>About Page</h1>
      <p>This is the About page</p>
      <div>
        <h2>LIFF Status</h2>
        {message && <p>{message}</p>}
        {error && (
          <p>
            <code>{error}</code>
          </p>
        )}
      </div>
    </div>
  );
};

export default AboutPage;