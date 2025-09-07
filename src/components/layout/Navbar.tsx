import { Link } from 'react-router-dom';
import { useLiff } from '../../contexts/LiffContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, login, logout } = useLiff();

  return (
    <nav
      style={{
        padding: '20px',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#00B900'
      }}>
        LIFF App
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none',
            color: '#333'
          }}
        >
          Home
        </Link>
        <Link 
          to="/about"
          style={{
            textDecoration: 'none',
            color: '#333'
          }}
        >
          About
        </Link>
      </div>

      <div>
        {!isLoggedIn ? (
          <button 
            onClick={login}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        ) : (
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
