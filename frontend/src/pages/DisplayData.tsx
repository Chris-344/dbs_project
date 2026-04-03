import ReadAuthors from "./components/ReadAuthors";
import ReadPublication from "./components/ReadBooks";
import NavigationBar from "./components/NavigationBar";
import ReadStudents from "./components/ReadStudents";

function DisplayData() {
  return (
    <>
      <div className="page">
        <NavigationBar />
        <ReadAuthors />
        <ReadPublication />
        <ReadStudents />
      </div>
    </>
  );
}

export default DisplayData;
