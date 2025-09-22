import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error details</summary>
            {this.state.error?.toString()}
          </details>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Reload Page
          </button>
          <style>{`
            .error-boundary {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 300px;
              padding: 20px;
              text-align: center;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              margin: 20px;
            }
            .error-boundary h2 {
              color: #d32f2f;
              margin-bottom: 16px;
            }
            .error-boundary details {
              margin: 16px 0;
              text-align: left;
              max-width: 500px;
              overflow: auto;
            }
            .retry-button {
              padding: 8px 16px;
              background: #00B900;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 16px;
            }
            .retry-button:hover {
              background: #007700;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;