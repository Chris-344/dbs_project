import "./App.css";
import AddAuthor from "./pages/AddAuthor";
import AddPublication from "./pages/AddPublication";

function App() {
  return (
    <>
      <h1>Publication Listing Service</h1>
      <AddPublication />
      <AddAuthor />
    </>
  );
}

export default App;
