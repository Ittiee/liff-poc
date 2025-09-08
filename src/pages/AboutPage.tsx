import React from "react";
// import { useLiff } from '../contexts/LiffContext';
import { useLiffHook } from "../hooks/useLiffHook";

const AboutPage: React.FC = () => {
  // const { message, error } = useLiff();

  const { message, error } = useLiffHook({
    liffId: import.meta.env.VITE_LIFF_ID_ABOUT,
  });

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
