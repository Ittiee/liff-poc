import React from "react";
// import { useLiff } from '../contexts/LiffContext';
import { useNavigate } from "react-router-dom";
import { useLiffHook } from "../hooks/useLiffHook";

const AboutPage: React.FC = () => {
  // const { message, error } = useLiff();

  const { message, error, isLoggedIn, login, logout } = useLiffHook({
    liffId: import.meta.env.VITE_LIFF_ID_ABOUT,
  });

  const navigate = useNavigate();

  return (
    <div>
      <h1>About Page</h1>
      <p>This is the About page</p>

      <button onClick={() => navigate("/")}>Go to Home</button>

      <div>
        <h2>LIFF Status</h2>
        {message && <p>{message}</p>}
        {error && (
          <p>
            <code>{error}</code>
          </p>
        )}
      </div>

      <div>
        {isLoggedIn ? (
          <button onClick={() => logout()}>Logout</button>
        ) : (
          <button onClick={() => login()}>Login</button>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
