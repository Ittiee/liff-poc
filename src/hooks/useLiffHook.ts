import liff from "@line/liff";
import { useEffect, useState } from "react";

interface UseLiffOptions {
  liffId: string;
  withLoginOnExternalBrowser?: boolean;
}

interface UseLiffReturn {
  message: string;
  error: string;
  isInitialized: boolean;
  isLoggedIn: boolean;
  userProfile: any | null;
  login: () => void;
  logout: () => void;
}

export const useLiffHook = (options: UseLiffOptions): UseLiffReturn => {
  const [message, setMessage] = useState("LIFF initializing...");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  const { liffId, withLoginOnExternalBrowser = false } = options;

  useEffect(() => {
    liff
      .init({
        liffId,
        withLoginOnExternalBrowser,
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
          // liff.login();
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

  return {
    message,
    error,
    isInitialized,
    isLoggedIn,
    userProfile,
    login,
    logout,
  };
};
