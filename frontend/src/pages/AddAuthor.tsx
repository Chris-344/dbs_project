import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function AddAuthor() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    dept: "",
    email: "",
    address: "",
    homepage: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/search", formData);
    } catch (err) {
      console.error(err);
    } finally {
      setFormData({ name: "", institution: "", dept: "", email: "", address: "", homepage: "" });
    }
  };

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search Author" },
  ];

  const fields = [
    { id: "name", label: "Name", placeholder: "Enter author name" },
    { id: "institution", label: "Institution", placeholder: "Enter author institution" },
    { id: "dept", label: "Department", placeholder: "Enter author department" },
    { id: "email", label: "Email", placeholder: "Enter author email" },
    { id: "address", label: "Address", placeholder: "Enter author address" },
    { id: "homepage", label: "Homepage", placeholder: "Enter author homepage" },
  ];

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
        <div className="form-heading">Add Author</div>

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
                    setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <hr className="form-divider" />
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAuthor;