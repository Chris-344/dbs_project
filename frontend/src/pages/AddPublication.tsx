import axios from "axios";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function AddPublication() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    authorId: "",
    title: "",
    year: "",
    source: "",
    copiesAvailable: "1",
  });

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search & Borrow" },
    { to: "/issue-history", label: "Issue History" },
  ];

  const fields = [
    { id: "authorId", label: "Author ID", placeholder: "Enter author ID (optional)", type: "text" },
    { id: "title", label: "Title", placeholder: "Enter publication title", type: "text" },
    { id: "year", label: "Year", placeholder: "Enter publication year", type: "number" },
    { id: "source", label: "Source", placeholder: "Enter publication source", type: "text" },
    { id: "copiesAvailable", label: "Available Copies", placeholder: "Number of copies", type: "number" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.title.trim()) {
      setErrorMessage("Publication title is required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/addPublication", formData);
      setSuccessMessage("Publication added successfully!");
      setFormData({
        authorId: "",
        title: "",
        year: "",
        source: "",
        copiesAvailable: "1",
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || "Failed to add publication");
      console.error(err);
    }
  };

  return (
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

      <div className="form-page">
        <div className="form-heading">Add Publication</div>
        <p className="form-subtitle">Add new publications to the database. Link with authors and set available copies for borrowing.</p>

        <div className="form-card">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div className="form-group" key={field.id}>
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.id]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  min={field.type === "number" ? "0" : undefined}
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
    </div>
  );
}

export default AddPublication;
