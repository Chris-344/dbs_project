import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// import ReadAuthors from "./pages/ReadAuthors";
import AddAuthor from "./pages/AddAuthor";
import AddBook from "./pages/AddBook";
import IssueHistory from "./pages/IssueHistory";
import IssueBook from "./pages/Issue_book";
import "./App.css";
import AddGenre from "./pages/AddGenre"
import Search from "./pages/Search";
import DisplayData from "./pages/DisplayData";
import AddStudent from "./pages/AddStudent";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
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
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/add-genre" element={<AddGenre />} />
          <Route path="/search-author" element={<Search />} />
          <Route path="/issue-history" element={<IssueHistory />} />
          <Route path="/issue-book" element={<IssueBook />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
