import NavigationBar from "./components/NavigationBar";
import { useState } from "react";
import axios from "axios";

function AddStudent() {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    class: "",
    section: "",
  });

  const fields = [
    { id: "studentId", label: "Student Id", placeholder: "Enter student id" },
    { id: "studentName", label: "Student Name", placeholder: "Enter student name" },
    { id: "class", label: "Student Class", placeholder: "Enter student class" },
    { id: "class", label: "Student Section", placeholder: "Enter student section" },
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
