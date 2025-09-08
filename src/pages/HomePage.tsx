import React from "react";
// import { useLiff } from '../contexts/LiffContext';
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { useLiffHook } from "../hooks";

const HomePage: React.FC = () => {
  // const { message, error, userProfile } = useLiff();
  const { message, error, isLoggedIn, logout, userProfile } = useLiffHook({
    liffId: import.meta.env.VITE_LIFF_ID_HOME,
  });

  const navigate = useNavigate();

  // ใช้ custom hook สำหรับจัดการ page navigation

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

      <button onClick={() => navigate("/about")}>Go to About</button>
      {isLoggedIn && <button onClick={() => logout()}>Logout</button>}

      {userProfile && <ProfileCard userProfile={userProfile} />}
    </div>
  );
};

export default HomePage;
