import { useState, useEffect } from "react";
import axios from "axios";

function ReadAuthors() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:5000/api/authors";
      try {
        const response = await axios.get(url);
        setAuthors(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

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
                  <td colSpan={7}>
                    <div className="empty">No authors found</div>
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
    </>
  );
}

export default ReadAuthors;
