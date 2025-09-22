import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import {
  LoginRequest,
  LoginResponse,
  mockAuthApi,
  RefreshResponse,
  User,
} from "./mockApi";

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  enableMocking?: boolean;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;
  private enableMocking: boolean;

  constructor(config: ApiClientConfig = {}) {
    this.enableMocking = config.enableMocking ?? true;

    // Load existing token from localStorage
    this.accessToken = localStorage.getItem("accessToken");

    this.axiosInstance = axios.create({
      baseURL: config.baseURL || "/api",
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // If we get 401 and haven't already tried to refresh
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          if (this.isRefreshing) {
            // Wait for ongoing refresh
            try {
              const newToken = await this.refreshPromise;
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return this.axiosInstance(originalRequest);
              }
            } catch {
              // Refresh failed, let the error propagate
            }
          } else {
            // Start refresh process
            originalRequest._retry = true;

            try {
              const newToken = await this.refreshAccessToken();
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return this.axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              // Refresh failed, clear token and let error propagate
              this.clearAccessToken();
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const newToken = await this.refreshPromise;
      this.setAccessToken(newToken);
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    if (this.enableMocking) {
      const response = await mockAuthApi.refresh();
      return response.accessToken;
    } else {
      const response = await this.axiosInstance.post<RefreshResponse>(
        "/auth/refresh"
      );
      return response.data.accessToken;
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem("accessToken");
    }
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
    localStorage.removeItem("accessToken");
  }

  // Auth API methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (this.enableMocking) {
      return mockAuthApi.login(credentials);
    } else {
      const response = await this.axiosInstance.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.enableMocking) {
        await mockAuthApi.logout();
      } else {
        await this.axiosInstance.post("/auth/logout");
      }
    } finally {
      this.clearAccessToken();
    }
  }

  async getMe(): Promise<User> {
    if (this.enableMocking) {
      return mockAuthApi.getMe(this.accessToken || "");
    } else {
      const response = await this.axiosInstance.get<User>("/auth/me");
      return response.data;
    }
  }

  // Generic API methods
  async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

// Create singleton instance
export const apiClient = new ApiClient({
  enableMocking: true, // Set to false when you have real backend
});

export default apiClient;

// Extend AxiosRequestConfig to include _retry flag
declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
