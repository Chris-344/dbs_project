import ReadAuthors from "./components/ReadAuthors";
import ReadPublication from "./components/ReadBooks";
import NavigationBar from "./components/NavigationBar";
import ReadStudents from "./components/ReadStudents";
import ReadGenre from "./components/ReadGenre"

function DisplayData() {
  return (
    <>
      <div className="page">
        <NavigationBar />
        <ReadAuthors />
        <ReadPublication />
        <ReadStudents />
        <ReadGenre />

      </div>
    </>
  );
}

export default DisplayData;
