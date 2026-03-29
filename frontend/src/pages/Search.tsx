import axios from "axios";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Search() {
  const [author, setAuthor] = useState("");
  const [answer, setAnswer] = useState([]);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search Author" },
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

  async function getAuthors(authorName: String) {
    let url = "http://localhost:5000/api/searchAuthorByName";
    let arg = { params: { author: authorName } };

    const res = await axios.get(url, arg);
    setAnswer(res.data);
    setAuthor("");
  }

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
            <div className="page-title">Search Author</div>
          </div>

          <label htmlFor="searchQueary" className="search-label">
            Search by Name
          </label>
          <div className="search-container">
            <input
              id="searchQueary"
              className="search-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              type="text"
              placeholder="Enter author name"
            />
            <button
              className="search-btn"
              onClick={() => {
                getAuthors(author);
              }}
            >
              Search
            </button>
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
                {answer.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty">
                      No authors found
                    </td>
                  </tr>
                ) : (
                  answer.map((ele, i) => (
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

export default Search;
