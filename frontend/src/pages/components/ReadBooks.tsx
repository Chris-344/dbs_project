import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../util/util";

function ReadPublication() {
  const [publication, setPublication] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url =endpoint.readBooks;
      try {
        const response = await axios.get(url);
        setPublication(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  const columns = ["ID", "Title", "Year", "Author id"];

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">Books</div>
        {publication.length > 0 && (
          <div className="page-count">{publication.length} records</div>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {publication.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty">No Book found</div>
                </td>
              </tr>
            ) : (
              publication.map((ele, i) => (
                <tr key={i}>
                  <td>{ele[0]}</td>
                  <td>{ele[1]}</td>
                  <td>{ele[2]}</td>
                  <td>{ele[3]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReadPublication;