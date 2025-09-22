// User type for token-based authentication
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
}

export interface AuthUser {
  user: User;
  isAuthenticated: boolean;
}

export interface AuthState {
  // Lifecycle states
  isBootstrapping: boolean;
  isInitialized: boolean;
  isLoggedIn: boolean;
  
  // User data
  user: User | null;
  
  // Error handling
  error: AuthError | null;
  
  // Loading states
  isLoading: boolean;
}

export interface AuthError {
  type: 'INIT_ERROR' | 'LOGIN_ERROR' | 'PROFILE_ERROR' | 'NETWORK_ERROR' | 'TOKEN_ERROR' | 'REFRESH_ERROR';
  message: string;
  code?: string;
  retryable: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthActions {
  login: (credentials: LoginCredentials, returnTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  retry: () => Promise<void>;
  clearError: () => void;
}

export interface AuthContextType extends AuthState, AuthActions {}

export interface AuthProviderProps {
  children: React.ReactNode;
  config?: {
    retryAttempts?: number;
    enableMocking?: boolean;
    apiBaseUrl?: string;
  };
}