import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// import ReadAuthors from "./pages/ReadAuthors";
import AddAuthor from "./pages/AddAuthor";
import AddPublication from "./pages/AddPublication";
import "./App.css";
import Search from "./pages/Search";
import DisplayData from "./pages/DisplayData";
function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        <Routes>
          <Route path="/" element={<DisplayData />} />
          <Route path="/add-author" element={<AddAuthor />} />
          <Route path="/add-publication" element={<AddPublication />} />
          <Route path="/search-author" element={<Search />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
