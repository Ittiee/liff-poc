import React from "react";
// import { useLiff } from '../contexts/LiffContext';
import ProfileCard from "../components/ProfileCard";
import { useLiffHook } from "../hooks";
import { usePageNavigation } from "../hooks/usePageNavigation";

const HomePage: React.FC = () => {
  // const { message, error, userProfile } = useLiff();
  const { message, error, userProfile } = useLiffHook({
    liffId: import.meta.env.VITE_LIFF_ID_HOME,
  });

  // ใช้ custom hook สำหรับจัดการ page navigation
  usePageNavigation({
    validPages: ["about"],
    replaceHistory: true,
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
