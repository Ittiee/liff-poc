// Mock API service for authentication
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}

interface ApiError {
  error: string;
  message: string;
  code?: string;
}

// Mock user database
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    roles: ["user"],
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    roles: ["user", "admin"],
  },
];

// Mock credentials (in real app this would be hashed and stored securely)
const MOCK_CREDENTIALS: Record<string, string> = {
  "user@example.com": "password123",
  "admin@example.com": "admin123",
};

// Mock session storage (in real app this would be a database)
interface Session {
  userId: string;
  refreshToken: string;
  createdAt: number;
  expiresAt: number;
  isRevoked: boolean;
}

const MOCK_SESSIONS = new Map<string, Session>();

// Token generation utilities
function generateToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateAccessToken(user: User): string {
  // Create a simple JWT-like token with header.payload.signature format
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };
  
  // Create JWT-like format: header.payload.signature
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = "mock-signature"; // In real JWT, this would be a proper signature
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function parseAccessToken(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = parseAccessToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const isExpired = payload.exp < Date.now() / 1000;
    return isExpired;
  } catch (error) {
    return true;
  }
}

// API simulation with delays
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apiResponse<T>(data: T, status: number = 200): Promise<T> {
  return delay().then(() => {
    if (status >= 400) {
      throw { status, data };
    }
    return data;
  });
}

// Mock API implementation
export const mockAuthApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay(800); // Simulate network delay

    const { email, password } = credentials;

    // Rate limiting simulation
    if (Math.random() < 0.05) {
      // 5% chance of rate limit
      throw {
        status: 429,
        data: {
          error: "TOO_MANY_REQUESTS",
          message: "Too many login attempts. Please try again later.",
        } as ApiError,
      };
    }

    // Validate credentials
    if (!MOCK_CREDENTIALS[email] || MOCK_CREDENTIALS[email] !== password) {
      throw {
        status: 401,
        data: {
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        } as ApiError,
      };
    }

    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      throw {
        status: 404,
        data: {
          error: "USER_NOT_FOUND",
          message: "User not found",
        } as ApiError,
      };
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateToken(64);

    // Store session
    const session: Session = {
      userId: user.id,
      refreshToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      isRevoked: false,
    };
    MOCK_SESSIONS.set(refreshToken, session);

    // Set HTTP-only cookie (simulated)
    if (typeof document !== "undefined") {
      document.cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${
        7 * 24 * 60 * 60
      }; Path=/`;
    }

    return apiResponse({
      accessToken,
      user,
    });
  },

  async refresh(): Promise<RefreshResponse> {
    await delay(200);

    // Get refresh token from cookie (simulated)
    const refreshToken = this.getRefreshTokenFromCookie();

    if (!refreshToken) {
      throw {
        status: 401,
        data: {
          error: "NO_REFRESH_TOKEN",
          message: "No refresh token provided",
        } as ApiError,
      };
    }

    const session = MOCK_SESSIONS.get(refreshToken);

    if (!session || session.isRevoked) {
      throw {
        status: 401,
        data: {
          error: "INVALID_REFRESH_TOKEN",
          message: "Invalid or revoked refresh token",
        } as ApiError,
      };
    }

    if (Date.now() > session.expiresAt) {
      MOCK_SESSIONS.delete(refreshToken);
      throw {
        status: 401,
        data: {
          error: "REFRESH_TOKEN_EXPIRED",
          message: "Refresh token has expired",
        } as ApiError,
      };
    }

    const user = MOCK_USERS.find((u) => u.id === session.userId);
    if (!user) {
      throw {
        status: 404,
        data: {
          error: "USER_NOT_FOUND",
          message: "User not found",
        } as ApiError,
      };
    }

    // Generate new tokens (rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateToken(64);

    // Revoke old session and create new one
    MOCK_SESSIONS.delete(refreshToken);
    const newSession: Session = {
      userId: user.id,
      refreshToken: newRefreshToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      isRevoked: false,
    };
    MOCK_SESSIONS.set(newRefreshToken, newSession);

    // Update cookie
    if (typeof document !== "undefined") {
      document.cookie = `refreshToken=${newRefreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${
        7 * 24 * 60 * 60
      }; Path=/`;
    }

    return apiResponse({
      accessToken: newAccessToken,
    });
  },

  async logout(): Promise<void> {
    await delay(100);

    const refreshToken = this.getRefreshTokenFromCookie();
    if (refreshToken) {
      const session = MOCK_SESSIONS.get(refreshToken);
      if (session) {
        session.isRevoked = true;
        MOCK_SESSIONS.delete(refreshToken);
      }
    }

    // Clear cookie
    if (typeof document !== "undefined") {
      document.cookie =
        "refreshToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/";
    }

    return apiResponse(undefined);
  },

  async getMe(accessToken: string): Promise<User> {
    await delay(150);

    if (!accessToken) {
      throw {
        status: 401,
        data: {
          error: "NO_ACCESS_TOKEN",
          message: "No access token provided",
        } as ApiError,
      };
    }

    if (isTokenExpired(accessToken)) {
      throw {
        status: 401,
        data: {
          error: "ACCESS_TOKEN_EXPIRED",
          message: "Access token has expired",
        } as ApiError,
      };
    }

    const payload = parseAccessToken(accessToken);
    if (!payload || !payload.sub) {
      throw {
        status: 401,
        data: {
          error: "INVALID_ACCESS_TOKEN",
          message: "Invalid access token",
        } as ApiError,
      };
    }

    const user = MOCK_USERS.find((u) => u.id === payload.sub);
    if (!user) {
      throw {
        status: 404,
        data: {
          error: "USER_NOT_FOUND",
          message: "User not found",
        } as ApiError,
      };
    }

    return apiResponse(user);
  },

  // Helper method to get refresh token from cookie
  getRefreshTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "refreshToken") {
        return value;
      }
    }
    return null;
  },

  // Debug helpers
  getActiveSessions(): Session[] {
    return Array.from(MOCK_SESSIONS.values()).filter((s) => !s.isRevoked);
  },

  revokeAllSessions(): void {
    MOCK_SESSIONS.clear();
  },
};

// Export types
export type { ApiError, LoginRequest, LoginResponse, RefreshResponse, User };
