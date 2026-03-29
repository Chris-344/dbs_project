import axios from "axios";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function AddPublication() {
  const location = useLocation();
  const [ids, setIds] = useState([]);

  const [formData, setFormData] = useState({
    authorId: "",
    title: "",
    year: "",
    source: "",
  });

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search Author" },
  ];

  const fields = [
    { id: "authorId", label: "Author ID", placeholder: "Enter author ID" },
    { id: "title", label: "Title", placeholder: "Enter publication title" },
    { id: "year", label: "Year", placeholder: "Enter publication year" },
    { id: "source", label: "Source", placeholder: "Enter publication source" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/addPublication", formData);
    } catch (err) {
      console.error(err);
    } finally {
      setFormData({
        authorId: "",
        title: "",
        year: "",
        source: "",
      });
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
    </div>
  );
}

export default AddPublication;
