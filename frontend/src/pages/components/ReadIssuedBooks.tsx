import axios from "axios";
import { endpoint } from "../../util/util";

interface Props {
  issuedBooks: any[];
  onRefresh: () => void;
}

function ReadIssuedBooks({ issuedBooks, onRefresh }: Props) {
  const columns = [
    "Borrow ID",
    "Book ID",
    "Student ID",
    "Issue Date",
    "Return Book",
  ];

  const formatDate = (value: string | null) => {
    if (!value) return "Not Returned";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  async function handleDeletion(borrowId: number) {
    try {
      await axios.delete(`${endpoint.issuedBooks}/${borrowId}`);
      onRefresh(); // re-fetch from parent after deletion
    } catch (err) {
      console.error("Error returning book:", err);
    }
  }

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">Issued Books</div>
        {issuedBooks.length > 0 && (
          <div className="page-count">{issuedBooks.length} records</div>
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
            {issuedBooks.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty">No issued books found</div>
                </td>
              </tr>
            ) : (
              issuedBooks.map((ele, i) => (
                <tr key={i}>
                  <td>{ele[0]}</td>
                  <td>{ele[1]}</td>
                  <td>{ele[2]}</td>
                  <td>{formatDate(ele[3])}</td>
                  <td>
                    <button onClick={() => handleDeletion(ele[0])}>
                      Return book
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReadIssuedBooks;