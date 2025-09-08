import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
// import { LiffProvider } from "./contexts/LiffContext";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    // <LiffProvider>
    <Router>
      <div className="App">
        {/* Header */}
        {/* <Navbar /> */}

        {/* Main Content  */}
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </Router>
    // </LiffProvider>
  );
}

export default App;
