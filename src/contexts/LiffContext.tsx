import liff from "@line/liff";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { getLiffIdForPath } from "../config/liffConfig";

interface LiffContextType {
  message: string;
  error: string;
  isInitialized: boolean;
  isLoggedIn: boolean;
  userProfile: any | null;
  currentLiffId: string | null;
  login: () => void;
  logout: () => void;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
};

interface LiffProviderProps {
  children: ReactNode;
}

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
  const location = useLocation();
  const [message, setMessage] = useState("LIFF initializing...");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [currentLiffId, setCurrentLiffId] = useState<string | null>(null);

  // ฟังก์ชันสำหรับ initialize LIFF
  const initializeLiff = async (liffId: string) => {
    try {
      setMessage("LIFF initializing...");
      setError("");
      setIsInitialized(false);

      await liff.init({ liffId });

      setMessage("LIFF init succeeded.");
      setIsInitialized(true);
      setCurrentLiffId(liffId);

      // Check if user is already logged in
      if (liff.isLoggedIn()) {
        setIsLoggedIn(true);
        try {
          const profile = await liff.getProfile();
          setUserProfile(profile);
        } catch (err) {
          console.error("Failed to get user profile:", err);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (e: any) {
      setMessage("LIFF init failed.");
      setError(`${e}`);
      setIsInitialized(false);
    }
  };

  // Effect สำหรับ initialize LIFF เมื่อ component mount
  useEffect(() => {
    const initialLiffId = getLiffIdForPath(location.pathname);
    initializeLiff(initialLiffId);
  }, []);

  // Effect สำหรับ re-initialize LIFF เมื่อ route เปลี่ยน
  useEffect(() => {
    const newLiffId = getLiffIdForPath(location.pathname);

    // ถ้า LIFF ID เปลี่ยน ให้ re-initialize
    if (currentLiffId && newLiffId !== currentLiffId) {
      initializeLiff(newLiffId);
    }
  }, [location.pathname, currentLiffId]);

  const login = () => {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  };

  const logout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setIsLoggedIn(false);
      setUserProfile(null);
      window.location.reload();
    }
  };

  const value = {
    message,
    error,
    isInitialized,
    isLoggedIn,
    userProfile,
    currentLiffId,
    login,
    logout,
  };

  // แสดง spinner ขณะ init
  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}>
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #00B900",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}></div>
        <p style={{ marginTop: "16px", color: "#666" }}>{message}</p>
        {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // แสดง children เมื่อ init เสร็จ
  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
};
