import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../ReadAuthors.css";

function ReadAuthors() {
  const [authors, setAuthors] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:5000/api/search";
      try {
        const response = await axios.get(url);
        setAuthors(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
  ];

  const columns = [
    "ID",
    "Name",
    "Institution",
    "Department",
    "Email",
    "Address",
    "Homepage",
  ];

  return (
    <>
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
            <div className="page-title">Authors</div>
            {authors.length > 0 && (
              <div className="page-count">{authors.length} records</div>
            )}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <td key={col}>{col}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {authors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty">
                      No authors found
                    </td>
                  </tr>
                ) : (
                  authors.map((ele, i) => (
                    <tr key={i}>
                      <td>{ele[0]}</td>
                      <td>{ele[1]}</td>
                      <td>{ele[2]}</td>
                      <td>{ele[3]}</td>
                      <td>{ele[4]}</td>
                      <td>{ele[5]}</td>
                      <td>{ele[6]}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReadAuthors;
