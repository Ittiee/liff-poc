import liff from "@line/liff";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface LiffContextType {
  message: string;
  error: string;
  isInitialized: boolean;
  isLoggedIn: boolean;
  userProfile: any | null;
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
  const [message, setMessage] = useState("LIFF initializing...");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
        setIsInitialized(true);

        // Check if user is already logged in
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          // Get user profile
          liff
            .getProfile()
            .then((profile) => {
              setUserProfile(profile);
            })
            .catch((err) => {
              console.error("Failed to get user profile:", err);
            });
        } else {
          setIsLoggedIn(false);
          liff.login();
        }
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
        setIsInitialized(false);
      });
  }, []);

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
