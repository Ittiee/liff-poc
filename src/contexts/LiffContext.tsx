import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import liff from '@line/liff';

interface LiffContextType {
  message: string;
  error: string;
  isInitialized: boolean;
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
        setIsInitialized(true);
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
        setIsInitialized(false);
      });
  }, []);

  const value = {
    message,
    error,
    isInitialized
  };

  return (
    <LiffContext.Provider value={value}>
      {children}
    </LiffContext.Provider>
  );
};