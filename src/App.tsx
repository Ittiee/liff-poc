import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LiffProvider } from './contexts/LiffContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import "./App.css";

function App() {
  return (
    <LiffProvider>
      <Router>
        <div className="App">
          <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
            <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
            <Link to="/about">About</Link>
            
          </nav>
          
          <div style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LiffProvider>
  );
}

export default App;
