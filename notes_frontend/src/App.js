import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import "./App.css";
import NotesPage from "./pages/NotesPage.jsx";

// PUBLIC_INTERFACE
function App() {
  /** Root app with theme toggling and routing for Notes. */
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark themes. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="App">
        <nav className="nm-topbar">
          <Link to="/" className="nm-logo">
            📝 NoteMaster
          </Link>
          <div className="nm-topbar-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title="Toggle theme"
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </nav>
        <div className="nm-content">
          <Routes>
            <Route path="/" element={<NotesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
