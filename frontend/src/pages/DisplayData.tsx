import ReadAuthors from "./components/ReadAuthors";
import ReadPublication from "./components/ReadBooks";
import NavigationBar from "./components/NavigationBar";

function DisplayData() {
  return (
    <>
      <div className="page">
        <NavigationBar />
        <ReadAuthors />
        <ReadPublication />
      </div>
    </>
  );
}

export default DisplayData;
