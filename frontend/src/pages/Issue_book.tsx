import { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import axios from "axios";

function Issue_book() {
  const [author, setAuthor] = useState("");
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    class: "",
    section: "",
  });

  const columns = [
    "book id",
    "book name",
    "student id",
    "issue date",
    "return date",
  ];

  const fields = [
    { id: "studentId", label: "Student Id", placeholder: "Enter student id" },
    { id: "bookId", label: "Book Id", placeholder: "Book Id" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/addStudent", formData);
    } catch (err) {
      console.error(err);
    } finally {
      setFormData({
        studentId: "",
        name: "",
        class: "",
        section: "",
      });
    }
  };

  async function getAuthors(authorName: String) {
    let url = "http://localhost:5000/api/issueBook";
    let arg = { params: { author: authorName } };

    const res = await axios.get(url, arg);
    setIssuedBooks(res.data);
    setAuthor("");
  }

  return (
    <>
      <div className="page">
        <NavigationBar />

        <div className="content">
          <div className="page-header">
            <div className="page-title">Issue book </div>
            <p className="page-subtitle">
              Just enter the student id and the book id to issue the book
            </p>
          </div>

          <div className="table-section">
            {issuedBooks.length > 0 && (
              <div className="results-header">
                <h3 className="results-title">Search Results</h3>
                <span className="results-count">
                  {issuedBooks.length}{" "}
                  {issuedBooks.length === 1 ? "author" : "authors"} found
                </span>
              </div>
            )}

            <div className="form-page">
              <div className="form-heading">Enter book to issue</div>

              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  {fields.map((field) => (
                    <div className="form-group" key={field.id}>
                      <label htmlFor={field.id}>{field.label}</label>
                      <input
                        type="text"
                        id={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.id]: e.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}

                  <hr className="form-divider" />
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </form>
              </div>
            </div>

            <div className="page-title">Issued books</div>
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
                  {issuedBooks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty">
                        <div className="empty-content">
                          <div className="empty-icon">◎</div>
                          <div className="empty-title">No authors found</div>
                          <div className="empty-message">
                            Try searching with a different name or visit our
                            Authors page to browse the complete directory.
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    issuedBooks.map((ele, i) => (
                      <tr key={i}>
                        <td>{ele[0]}</td>
                        <td>{ele[1]}</td>
                        <td>{ele[2]}</td>
                        <td>{ele[3]}</td>
                        <td>{ele[4]}</td>
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

export default Issue_book;
