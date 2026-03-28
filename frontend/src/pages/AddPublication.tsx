import { Link } from "react-router-dom";
function AddPublication() {
  return (
    <div className="add-publication-container">
      <Link to='/'>Read authors</Link>{" "}
      <Link to="/add-publication">Add Publication</Link>{" "}
      <Link to="/add-author">Add Authors</Link>

      <h2>Add Publication</h2>
      <form method="get">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" placeholder="Enter publication title" />
        </div>
        <div className="form-group">
          <label htmlFor="authors">Authors</label>
          <input type="text" id="authors" placeholder="Enter author names" />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input type="text" id="year" placeholder="Enter publication year" />
        </div>
        <div className="form-group">
          <label htmlFor="source">Source</label>
          <input
            type="text"
            id="source"
            placeholder="Enter publication source"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddPublication;
