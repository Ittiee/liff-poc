# Token-Based React Authentication System

## Overview
Professional React authentication system using JWT tokens with access/refresh token rotation, replacing the previous LIFF integration. Follows 2024 security best practices.

## Architecture

### Authentication Context (`src/contexts/AuthContext.tsx`)
- **Single source of truth** for auth state across the app
- Handles token-based login/logout, profile management
- Proper TypeScript typing with `AuthState` and `AuthActions`
- Error boundaries and graceful error handling
- Secure token management with access tokens in memory and refresh tokens in HttpOnly cookies

### Protected Routes (`src/components/auth/ProtectedRoute.tsx`)
- Route-level authentication guards
- Configurable `requiresAuth` flag per route
- Automatic redirect with `returnTo` parameter
- Loading states during auth checks

### Error Handling
- **ErrorBoundary**: Catches React rendering errors
- **Granular error types**: INIT_ERROR, LOGIN_ERROR, PROFILE_ERROR, NETWORK_ERROR
- **Retry mechanisms**: Configurable retry attempts with backoff
- **User-friendly messages**: Clear feedback for different error scenarios

## Key Features

### Security Best Practices
- No tokens stored in localStorage/sessionStorage
- LIFF SDK handles secure token management
- Server-side validation required for protected APIs
- Proper CSRF protection when using cookies
- Minimal profile data storage

### User Experience
- **Loading states**: Spinners during initialization and auth operations
- **Return-to functionality**: Preserves intended destination after login
- **Graceful degradation**: Works in external browsers with proper messaging
- **Consistent UI**: Professional design with hover states and transitions

### State Management
- **Lifecycle tracking**: isBootstrapping, isInitialized, isLoggedIn
- **Memory leak prevention**: Cleanup on component unmount
- **Stable context**: Prevents unnecessary re-renders

## Route Configuration

```typescript
// Public route (no auth required)
<Route path="/" element={
  <ProtectedRoute requiresAuth={false}>
    <HomePage />
  </ProtectedRoute>
} />

// Protected route (login required)
<Route path="/about" element={
  <ProtectedRoute requiresAuth={true} fallbackPath="/login">
    <AboutPage />
  </ProtectedRoute>
} />
```

## Mock API (`src/services/mockApi.ts`)
- Complete authentication backend simulation
- JWT token generation and validation
- Session management with refresh token rotation
- Rate limiting and error simulation
- Demo users: user@example.com/password123, admin@example.com/admin123

## API Client (`src/services/apiClient.ts`)
- Axios-based HTTP client with automatic token management
- Request/response interceptors for auth headers
- Automatic token refresh on 401 errors
- Concurrent request handling during refresh
- Configurable for real backend integration

## Configuration
- AuthProvider config: enableMocking, retryAttempts, apiBaseUrl
- Switch enableMocking to false for real backend integration

## Migration from LIFF
- **Removed**: LIFF SDK dependency and related hooks
- **Added**: Token-based authentication with proper JWT handling
- **Enhanced**: Login forms with email/password instead of social auth
- **Improved**: Better error handling and security practices

## Commands to Run After Changes
- `npm run build` - Check for TypeScript errors
- `npm run dev` - Test authentication flow in any browser
- Verify protected routes and token refresh work correctly

## Token Security Features
- **Access tokens**: 15-minute lifespan, stored in memory only
- **Refresh tokens**: 7-day lifespan, HttpOnly cookies, automatic rotation
- **CSRF protection**: SameSite cookies and double-submit pattern ready
- **XSS protection**: No tokens stored in localStorage/sessionStorage
- **Replay detection**: Refresh token rotation prevents token reuse

## Future Enhancements
- Add real JWT signing/verification (currently base64 encoded)
- Implement proper CSRF protection for production
- Add offline support and network detection
- Consider managed auth providers (Auth0, Clerk) for production use
- Add role-based route restrictions

## Common Patterns

### Using Authentication in Components
```typescript
const { isLoggedIn, user, login, logout } = useAuth();

// Login with credentials
const handleLogin = async (credentials) => {
  try {
    await login(credentials);
  } catch (error) {
    // Handle login error
  }
};

if (!isLoggedIn) {
  return <LoginForm onSubmit={handleLogin} />;
}

return <UserContent user={user} onLogout={logout} />;
```

### Error Handling
```typescript
const { error, retry, clearError } = useAuth();

if (error) {
  return (
    <ErrorDisplay 
      error={error} 
      onRetry={error.retryable ? retry : undefined}
      onDismiss={clearError}
    />
  );
}
```