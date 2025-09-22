import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isLoggedIn, isLoading, user, login, logout } = useAuth();
  const location = useLocation();

  return (
    <nav
      style={{
        padding: "20px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#00B900",
        }}>
        LIFF App
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#333",
          }}>
          Home
        </Link>
        <Link
          to="/about"
          style={{
            textDecoration: "none",
            color: "#333",
          }}>
          About
        </Link>
        {isLoggedIn && (
          <Link
            to="/profile"
            style={{
              textDecoration: "none",
              color: "#333",
            }}>
            Profile
          </Link>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isLoggedIn && user && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            fontSize: "14px",
            color: "#666"
          }}>
            {user.avatar && (
              <img 
                src={user.avatar} 
                alt={user.name}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%"
                }}
              />
            )}
            <span>Hi, {user.name}</span>
            {user.roles.includes('admin') && (
              <span style={{
                background: "#00B900",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "bold"
              }}>ADMIN</span>
            )}
          </div>
        )}
        
        {!isLoggedIn ? (
          <Link 
            to={`/login?returnTo=${encodeURIComponent(location.pathname)}`}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              textDecoration: "none",
              display: "inline-block",
            }}>
            {isLoading ? "Loading..." : "Sign In"}
          </Link>
        ) : (
          <button
            onClick={logout}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#f44336",
              color: "white",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}>
            {isLoading ? "Signing out..." : "Sign Out"}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
