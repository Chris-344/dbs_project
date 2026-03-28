import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function AddAuthor() {
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
      setFormData({
        name: "",
        institution: "",
        dept: "",
        email: "",
        address: "",
        homepage: "",
      });
    }
  };

  return (
    <div className="add-author-container">
     <Link to="/">Read Authors</Link> <Link to="/add-publication">Add Publication</Link>  <Link to="/add-author">Add Authors</Link>
      <h2>Add Author</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Name">Name</label>
          <input
            type="text"
            id="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((formData) => ({ ...formData, name: e.target.value }))
            }
            placeholder="Enter author name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Institution">Institution</label>
          <input
            type="text"
            id="Institution"
            value={formData.institution}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                institution: e.target.value,
              }))
            }
            placeholder="Enter author institution"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dept">dept</label>
          <input
            type="text"
            id="dept"
            value={formData.dept}
            onChange={(e) =>
              setFormData((formData) => ({ ...formData, dept: e.target.value }))
            }
            placeholder="Enter author dept"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                email: e.target.value,
              }))
            }
            placeholder="Enter author email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">address</label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                address: e.target.value,
              }))
            }
            placeholder="Enter author address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="homepage">homepage</label>
          <input
            type="text"
            id="homepage"
            value={formData.homepage}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                homepage: e.target.value,
              }))
            }
            placeholder="Enter author homepage"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddAuthor;
