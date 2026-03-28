import "./App.css";
import AddAuthor from "./pages/AddAuthor";
import AddPublication from "./pages/AddPublication";
import ReadAuthors from "./pages/ReadAuthors";

function App() {
  return (
    <>
      <h1>Publication Listing Service</h1>
      <AddPublication />
      <AddAuthor />
      <ReadAuthors />
    </>
  );
}

export default App;
