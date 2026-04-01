import axios from "axios";
import { useState } from "react";
import NavigationBar from "./components/NavigationBar";

function Search() {
  const [author, setAuthor] = useState("");
  const [answer, setAnswer] = useState([]);

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
      <NavigationBar/>

        <div className="content">
          <div className="page-header">
            <div className="page-title">Search Author</div>
            <p className="page-subtitle">Find research authors in our database by name. Explore their institutions, departments, contact information, and published work.</p>
          </div>

          <div className="search-section">
            <div className="search-header">
              <label htmlFor="searchQueary" className="search-label">
                Search by Name
              </label>
              <span className="search-hint">Enter the author's full or partial name to find their profile</span>
            </div>
            <div className="search-container">
              <input
                id="searchQueary"
                className="search-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                type="text"
                placeholder="e.g., John Smith, Jane Doe..."
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
          </div>

          <div className="table-section">
            {answer.length > 0 && (
              <div className="results-header">
                <h3 className="results-title">Search Results</h3>
                <span className="results-count">{answer.length} {answer.length === 1 ? "author" : "authors"} found</span>
              </div>
            )}
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
                        <div className="empty-content">
                          <div className="empty-icon">◎</div>
                          <div className="empty-title">No authors found</div>
                          <div className="empty-message">Try searching with a different name or visit our Authors page to browse the complete directory.</div>
                        </div>
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
      </div>
    </>
  );
}

export default Search;
