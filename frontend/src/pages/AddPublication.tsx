function AddPublication() {
  return (
    <div className="add-publication-container">
      <h2>Add Publication</h2>
      <form action="" method="post">
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
