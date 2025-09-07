import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import liff from '@line/liff';

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
    throw new Error('useLiff must be used within a LiffProvider');
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
          liff.getProfile()
            .then((profile) => {
              console.log('profile', profile)
              setUserProfile(profile);
            })
            .catch((err) => {
              console.error('Failed to get user profile:', err);
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
    logout
  };

  return (
    <LiffContext.Provider value={value}>
      {children}
    </LiffContext.Provider>
  );
};