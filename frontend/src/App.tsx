import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReadAuthors from "./pages/ReadAuthors";
import AddAuthor from "./pages/AddAuthor";
import AddPublication from "./pages/AddPublication";
import "./App.css";
import Search from "./pages/Search";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReadAuthors />} />
        <Route path="/add-author" element={<AddAuthor />} />
        <Route path="/add-publication" element={<AddPublication />} />
        <Route path="/search-author" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 