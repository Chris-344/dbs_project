import { useEffect, useState } from "react";
import NavigationBar from "./components/NavigationBar";
import axios from "axios";
import { endpoint } from "../util/util";
function IssueHistory() {
  const [authors, setAuthors] = useState([]);
  const formatDate = (value: string | null) => {
    if (!value) return "Not Returned";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      const url = endpoint.issueHistory;
      try {
        const response = await axios.get(url);
        setAuthors(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  const columns = ["ID", "Name", "Institution", "issue date", "return date"];
  return (
    <>
      <NavigationBar />
      <div className="content">
        <div className="page-header">
          <div className="page-title">Issue History</div>
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
                  <td colSpan={5}>
                    <div className="empty">No authors found</div>
                  </td>
                </tr>
              ) : (
                authors.map((ele, i) => (
                  <tr key={i}>
                    <td>{ele[0]}</td>
                    <td>{ele[1]}</td>
                    <td>{ele[2]}</td>
                    <td>{formatDate(ele[3])}</td>
                    <td>{formatDate(ele[4])}</td>
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

export default IssueHistory;
