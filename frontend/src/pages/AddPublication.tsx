import { Link, useLocation } from "react-router-dom";

function AddPublication() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
  ];

  return (
    <div className="page">
      <nav className="nav">
        <span className="nav-brand">ResearchDB</span>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="form-page">
        <div className="form-heading">Add Publication</div>

        <div className="form-card">
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
              <input type="text" id="source" placeholder="Enter publication source" />
            </div>

            <hr className="form-divider" />

            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPublication;