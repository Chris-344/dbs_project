import { useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../ReadAuthors.css";

interface Publication {
  [key: number]: any;
}

function Search() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({
    title: "",
    institution: "",
    department: "",
  });

  const [results, setResults] = useState<Publication[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchParams.title) params.append("title", searchParams.title);
      if (searchParams.institution) params.append("institution", searchParams.institution);
      if (searchParams.department) params.append("department", searchParams.department);

      const response = await axios.get(
        `http://localhost:5000/api/publications/search?${params.toString()}`
      );
      setResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search", label: "Search Publications" },
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

      <div className="content">
        <div className="page-header">
          <div className="page-title">Search Publications</div>
        </div>

        <div className="form-card" style={{ marginBottom: "20px" }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label htmlFor="title">Publication Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={searchParams.title}
                  onChange={handleInputChange}
                  placeholder="Enter publication title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="institution">Institution</label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={searchParams.institution}
                  onChange={handleInputChange}
                  placeholder="Enter author institution"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={searchParams.department}
                  onChange={handleInputChange}
                  placeholder="Enter author department"
                />
              </div>
            </div>

            <hr className="form-divider" />
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {hasSearched && (
          <div>
            <div className="page-header">
              <div className="page-title">Results</div>
              {results.length > 0 && (
                <div className="page-count">{results.length} publication(s) found</div>
              )}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <td>Publication ID</td>
                    <td>Title</td>
                    <td>Year</td>
                    <td>Source</td>
                    <td>Pages</td>
                    <td>Author Name</td>
                    <td>Institution</td>
                    <td>Department</td>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty">
                        No publications found
                      </td>
                    </tr>
                  ) : (
                    results.map((row, i) => (
                      <tr key={i}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>
                          {row[4] && row[5] ? `${row[4]}-${row[5]}` : "-"}
                        </td>
                        <td>{row[7] || "-"}</td>
                        <td>{row[8] || "-"}</td>
                        <td>{row[9] || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;