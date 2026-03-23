function AddAuthor() {
  return (
    <div className="add-author-container">
      <h2>Add Author</h2>
      <form action="/" method="post">
        <div className="form-group">
          <label htmlFor="Name">Name</label>
          <input type="text" id="Name" placeholder="Enter author name" />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input type="text" id="year" placeholder="Enter birth year" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddAuthor;
