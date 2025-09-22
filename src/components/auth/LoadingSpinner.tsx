import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px',
  };

  return (
    <div className="loading-container">
      <div className="spinner" style={{ width: sizeMap[size], height: sizeMap[size] }} />
      {message && <p className="loading-message">{message}</p>}
      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          min-height: 200px;
        }
        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #00B900;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loading-message {
          margin-top: 16px;
          color: #666;
          font-size: 14px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;