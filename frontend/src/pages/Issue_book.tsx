import { useState, useEffect } from "react";
import NavigationBar from "./components/NavigationBar";
import axios from "axios";
import { endpoint } from "../util/util";
import ReadIssuedBooks from "./components/ReadIssuedBooks";

function Issue_book() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    bookId: "",
  });

  const fields = [
    { id: "studentId", label: "Student Id", placeholder: "Enter student id" },
    { id: "bookId", label: "Book Id", placeholder: "Book Id" },
  ];

  useEffect(() => {
    getIssuedBooks();
  }, []);

  async function getIssuedBooks() {
    try {
      const res = await axios.get(endpoint.issuedBooks);
      setIssuedBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(endpoint.issueBook, formData);
      await getIssuedBooks();
    } catch (err) {
      console.error(err);
    } finally {
      setFormData({ studentId: "", bookId: "" });
    }
  };

  return (
    <>
      <div className="page">
        <NavigationBar />
        <div className="content">
          <div className="page-header">
            <div className="page-title">Issue book</div>
            <p className="page-subtitle">
              Just enter the student id and the book id to issue the book
            </p>
          </div>
          <div className="table-section">
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
                    Issue
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ReadIssuedBooks issuedBooks={issuedBooks} onRefresh={getIssuedBooks}/>
      </div>
    </>
  );
}

export default Issue_book;