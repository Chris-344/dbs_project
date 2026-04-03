import axios from "axios";
import React, { useState } from "react";
import NavigationBar from "./components/NavigationBar";

function AddAuthor() {
  const [formData, setFormData] = useState({
    id:"",
    name: "",
    institution: "",
    dept: "",
    email: "",
    homepage: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields client-side
    if (!formData.name || !formData.institution || !formData.dept) {
      alert("Name, Institution, and Department are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/addAuthor", formData);
      alert("Author added successfully!");
      setFormData({
        id:"",
        name: "",
        institution: "",
        dept: "",
        email: "",
        homepage: "",
        address: "",
      });
    } catch (err: any) {
      console.error(err);
      // Show the actual server error message
      alert(
        "Error adding author: " + (err.response?.data?.error || err.message),
      );
    }
  };


  const fields = [
    { id: "name", label: "Name", placeholder: "Enter author name" },
    {
      id: "institution",
      label: "institution",
      placeholder: "Enter author institution",
    },
    { id: "dept", label: "Department", placeholder: "Enter author department" },
    { id: "email", label: "Email", placeholder: "Enter author email" },
    { id: "address", label: "Address", placeholder: "Enter author address" },
    { id: "homepage", label: "homepage", placeholder: "Enter author homepage" },
  ];

  return (
    <div className="page">
    <NavigationBar/>

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

export default AddAuthor;
