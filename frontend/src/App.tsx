import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddAuthor from "./pages/AddAuthor";
import AddPublication from "./pages/AddPublication";
import "./App.css";
import Search from "./pages/Search";
import DisplayData from "./pages/DisplayData";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayData />} />
        <Route path="/add-author" element={<AddAuthor />} />
        <Route path="/add-publication" element={<AddPublication />} />
        <Route path="/search-author" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
