import axios from "axios";
import { useState } from "react";
import NavigationBar from "./components/NavigationBar";
import { endpoint } from "../util/util";

function AddGenre() {
  const [formData, setFormData] = useState({
    bookId: "",
    genreName: "",
  });

  const fields = [
    { id: "bookId", label: "Book ID", placeholder: "Enter Book ID" },
    { id: "genreName", label: "Genre Name", placeholder: "Enter Genre Name" }, 
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(endpoint.addGenre, {
        bookId: formData.bookId, // now sent to backend
        genreName: formData.genreName,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFormData({
        bookId: "",
        genreName: "",
      });
    }
  };

  return (
    <div className="page">
      <NavigationBar />

      <div className="form-page">
        <div className="form-heading">Add Genre</div>

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

export default AddGenre; // fixed export name too
