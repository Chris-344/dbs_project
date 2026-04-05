import axios from "axios";
import { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import { endpoint } from "../util/util";

function AddBook() {
  const [formData, setFormData] = useState({
    authorId: "",
    title: "",
    year: "",
    source: "",
  });

  const fields = [
    { id: "authorId", label: "Author ID", placeholder: "Enter author ID" },
    { id: "title", label: "Title", placeholder: "Enter publication title" },
    {
      id: "year",
      label: "Year",
      placeholder: "Enter publication year",
      type: "number",
    },
    { id: "source", label: "Source", placeholder: "Enter publication source" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(endpoint.addBook, formData);
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
      <NavigationBar />

      <div className="form-page">
        <div className="form-heading">Add Publication</div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div className="form-group" key={field.id}>
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  type={field.type || "text"}
                  id={field.id}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (field.type === "number") {
                      const allowed = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ];
                      if (!/^\d$/.test(e.key) && !allowed.includes(e.key)) {
                        e.preventDefault();
                      }
                    }
                  }}
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

export default AddBook;
