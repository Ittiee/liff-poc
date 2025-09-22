import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiClient } from "../services/apiClient";
import {
  AuthContextType,
  AuthError,
  AuthProviderProps,
  AuthState,
  LoginCredentials,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const DEFAULT_CONFIG = {
  retryAttempts: 3,
  enableMocking: true,
  apiBaseUrl: "/api",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  config = DEFAULT_CONFIG,
}) => {
  const [state, setState] = useState<AuthState>({
    isBootstrapping: true,
    isInitialized: false,
    isLoggedIn: false,
    user: null,
    error: null,
    isLoading: false,
  });

  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const returnToRef = useRef<string | null>(null);

  // Safe state update that checks if component is still mounted
  const safeSetState = useCallback(
    (
      updater: Partial<AuthState> | ((prev: AuthState) => Partial<AuthState>)
    ) => {
      if (!mountedRef.current) return;

      setState((prevState) => {
        const updates =
          typeof updater === "function" ? updater(prevState) : updater;
        return { ...prevState, ...updates };
      });
    },
    []
  );

  const createError = useCallback(
    (type: AuthError["type"], message: string, code?: string): AuthError => ({
      type,
      message,
      code,
      retryable: type !== "LOGIN_ERROR",
    }),
    []
  );

  const clearError = useCallback(() => {
    safeSetState({ error: null });
  }, [safeSetState]);

  const getUserProfile = useCallback(async () => {
    try {
      const user = await apiClient.getMe();
      return user;
    } catch (error: any) {
      console.error("Failed to get user profile:", error);
      throw createError(
        "PROFILE_ERROR",
        error?.response?.data?.message || "Failed to retrieve user profile",
        error?.response?.data?.error || "PROFILE_FETCH_ERROR"
      );
    }
  }, [createError]);

  const initializeAuth = useCallback(async () => {
    try {
      safeSetState({ isBootstrapping: true, error: null });

      // Check if we have an existing access token
      const existingToken = apiClient.getAccessToken();

      if (existingToken) {
          // We have a token, try to get user profile
          safeSetState({ isLoading: true });

          try {
            const user = await getUserProfile();
          safeSetState({
            isLoggedIn: true,
            user,
            isInitialized: true,
            isBootstrapping: false,
            isLoading: false,
          });

          // Handle return path after login
          if (returnToRef.current) {
            const returnTo = returnToRef.current;
            returnToRef.current = null;
            // Use setTimeout to allow state to update first
            setTimeout(() => {
              window.location.href = returnTo;
            }, 100);
          }
        } catch (error: any) {
            // Token is invalid or expired, clear it and set logged out state
            apiClient.clearAccessToken();
            safeSetState({
              isLoggedIn: false,
              user: null,
              isInitialized: true,
              isBootstrapping: false,
              isLoading: false,
            });
        }
      } else {
          // No token, user is not logged in
          safeSetState({
            isLoggedIn: false,
            user: null,
            isInitialized: true,
            isBootstrapping: false,
            isLoading: false,
          });
      }

      retryCountRef.current = 0; // Reset retry count on success
    } catch (error: any) {
      console.error("Auth initialization failed:", error);
      const authError = createError(
        "INIT_ERROR",
        error?.response?.data?.message ||
          "Authentication system initialization failed",
        error?.response?.data?.error || "INIT_FAILED"
      );

      safeSetState({
        error: authError,
        isBootstrapping: false,
        isInitialized: false,
        isLoading: false,
      });
    }
  }, [createError, getUserProfile, safeSetState]);

  const login = useCallback(
    async (credentials: LoginCredentials, returnTo?: string) => {
      try {
        if (returnTo) {
          returnToRef.current = returnTo;
        }

        if (!state.isInitialized) {
          throw createError(
            "LOGIN_ERROR",
            "Authentication system is not initialized",
            "NOT_INITIALIZED"
          );
        }

        safeSetState({ isLoading: true, error: null });

        // Perform login
        const response = await apiClient.login(credentials);

        // Set access token in API client
        apiClient.setAccessToken(response.accessToken);

        safeSetState({
          isLoggedIn: true,
          user: response.user,
          isLoading: false,
          error: null,
        });

        // Handle return path after login
        if (returnToRef.current) {
          const returnTo = returnToRef.current;
          returnToRef.current = null;
          setTimeout(() => {
            window.location.href = returnTo;
          }, 100);
        }
      } catch (error: any) {
        console.error("Login failed:", error);
        const authError = createError(
          "LOGIN_ERROR",
          error?.response?.data?.message ||
            error?.data?.message ||
            "Login failed",
          error?.response?.data?.error || error?.data?.error || "LOGIN_FAILED"
        );

        safeSetState({
          error: authError,
          isLoading: false,
        });
        throw authError;
      }
    },
    [state.isInitialized, createError, safeSetState]
  );

  const logout = useCallback(async () => {
    try {
      safeSetState({ isLoading: true });

      // Call logout API
      await apiClient.logout();

      // Clear access token
      apiClient.clearAccessToken();

      safeSetState({
        isLoggedIn: false,
        user: null,
        error: null,
        isLoading: false,
      });

      returnToRef.current = null;

      // Navigate to home page after logout
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state
      apiClient.clearAccessToken();
      safeSetState({
        isLoggedIn: false,
        user: null,
        isLoading: false,
      });
    }
  }, [safeSetState]);

  const retry = useCallback(async () => {
    const maxRetries = config.retryAttempts ?? DEFAULT_CONFIG.retryAttempts;
    if (retryCountRef.current >= maxRetries) {
      safeSetState({
        error: createError(
          "NETWORK_ERROR",
          "Maximum retry attempts reached",
          "MAX_RETRIES"
        ),
      });
      return;
    }

    retryCountRef.current += 1;
    await initializeAuth();
  }, [config.retryAttempts, createError, initializeAuth, safeSetState]);

  // Initialize LIFF on mount
  useEffect(() => {
    initializeAuth();

    return () => {
      mountedRef.current = false;
    };
  }, [initializeAuth]);

  // Create stable context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    retry,
    clearError,
  };

  // Show loading spinner during bootstrap
  if (state.isBootstrapping) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
        <p>Initializing authentication...</p>
        <style>{`
          .auth-loading {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #00B900;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
