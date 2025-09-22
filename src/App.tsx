import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/auth/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider config={{ enableMocking: true, retryAttempts: 3 }}>
        <Router>
          <div className="App">
            {/* Header */}
            <Navbar />

            {/* Main Content  */}
            <div style={{ padding: "20px" }}>
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requiresAuth={false}>
                      <LoginPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Public routes - no authentication required */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                
                {/* Protected routes - authentication required */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute requiresAuth={true} fallbackPath="/login">
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
