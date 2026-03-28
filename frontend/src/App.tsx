import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ReadAuthors from "./pages/ReadAuthors";
import AddAuthor from "./pages/AddAuthor";
import AddPublication from "./pages/AddPublication";
import "./App.css";
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReadAuthors />} />
          <Route path="/add-author" element={<AddAuthor />} />
          <Route path="/add-publication" element={<AddPublication />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
