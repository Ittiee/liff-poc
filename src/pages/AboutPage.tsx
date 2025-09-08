import React from "react";
// import { useLiff } from '../contexts/LiffContext';
import { useNavigate } from "react-router-dom";
import { useLiffHook } from "../hooks/useLiffHook";

const AboutPage: React.FC = () => {
  // const { message, error } = useLiff();

  const { message, error, isLoggedIn, logout } = useLiffHook({
    liffId: import.meta.env.VITE_LIFF_ID_ABOUT,
  });

  const navigate = useNavigate();

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

      <button onClick={() => navigate("/")}>Go to Home</button>
      {isLoggedIn && <button onClick={() => logout()}>Logout</button>}
    </div>
  );
};

export default AboutPage;
