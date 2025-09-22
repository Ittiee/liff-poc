import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAuth = true, 
  fallbackPath = '/' 
}) => {
  const { isInitialized, isLoggedIn, isLoading, error } = useAuth();
  const location = useLocation();

  // Still initializing
  if (!isInitialized && !error) {
    return <LoadingSpinner message="Initializing..." />;
  }

  // Initialization failed
  if (error && !isInitialized) {
    return (
      <div className="auth-error">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        {error.retryable && (
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        )}
        <style>{`
          .auth-error {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 50vh;
            text-align: center;
            padding: 20px;
          }
          .auth-error h2 {
            color: #d32f2f;
            margin-bottom: 16px;
          }
          .auth-error button {
            margin-top: 16px;
            padding: 8px 16px;
            background: #00B900;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  // Loading user data
  if (isLoading) {
    return <LoadingSpinner message="Loading user data..." />;
  }

  // Route requires authentication but user is not logged in
  if (requiresAuth && !isLoggedIn) {
    // Store the intended destination
    const returnTo = location.pathname + location.search;
    return (
      <Navigate 
        to={`${fallbackPath}?returnTo=${encodeURIComponent(returnTo)}`} 
        replace 
      />
    );
  }

  // Route doesn't require auth or user is authenticated
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default ProtectedRoute;