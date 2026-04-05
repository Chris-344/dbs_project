import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../util/util";

function ReadStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = endpoint.readStudent;
      try {
        const response = await axios.get(url);
        setStudents(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  const columns = ["ID", "Name", "Email", "Department"];

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">Students</div>
        {students.length > 0 && (
          <div className="page-count">{students.length} records</div>
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
            {students.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty">No students found</div>
                </td>
              </tr>
            ) : (
              students.map((ele, i) => (
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

export default ReadStudents;
