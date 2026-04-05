import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../util/util";

function ReadGenre() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint.readGenre);
        setGenres(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  const columns = ["Genre ID", "Category Name"];

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">Genres</div>
        {genres.length > 0 && (
          <div className="page-count">{genres.length} records</div>
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
            {genres.length === 0 ? (
              <tr>
                <td colSpan={2}>
                  <div className="empty">No genres found</div>
                </td>
              </tr>
            ) : (
              genres.map((row, i) => (
                <tr key={i}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReadGenre;