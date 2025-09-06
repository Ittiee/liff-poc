import React from 'react';
import { useLiff } from '../contexts/LiffContext';

const HomePage: React.FC = () => {
  const { message, error, isInitialized } = useLiff();

  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the Home page</p>
      <div>
        <h2>create-liff-app</h2>
        {message && <p>{message}</p>}
        {error && (
          <p>
            <code>{error}</code>
          </p>
        )}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
        >
          LIFF Documentation
        </a>
      </div>
    </div>
  );
};

export default HomePage;