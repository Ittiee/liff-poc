import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LiffProvider } from './contexts/LiffContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import "./App.css";
import Navbar from './components/layout/Navbar';
function App() {
  return (
    <Router>
      <LiffProvider>
        <div className="App">
          {/* Header */}
          <Navbar />

          {/* Main Content */}
          <div style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </div>
      </LiffProvider>
    </Router>
  );
}

export default App;
