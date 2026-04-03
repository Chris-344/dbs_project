import NavigationBar from "./components/NavigationBar";
import { useState } from "react";
import axios from "axios";
import { endpoint } from "../util/util";

function AddStudent() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
  });

  const fields = [
    { id: "id", label: "Student ID", placeholder: "Enter student ID" },
    { id: "name", label: "Student Name", placeholder: "Enter student name" },
    { id: "email", label: "Email", placeholder: "Enter email" },
    { id: "department", label: "Department", placeholder: "Enter department" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(endpoint.addStudent, formData);
      alert("Student added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding student");
    } finally {
      setFormData({
        id: "",
        name: "",
        email: "",
        department: "",
      });
    }
  };

  return (
    <div className="page">
      <NavigationBar />

      <div className="form-page">
        <div className="form-heading">Add Student</div>

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

export default AddStudent;
