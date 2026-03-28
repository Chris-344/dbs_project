import { useState, useEffect } from "react";
import axios from "axios";

function ReadAuthors() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:5000/api/search";
      try {
        const response = await axios.get(url);
        setAuthors(response.data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  return <div>{JSON.stringify(authors)}</div>;
}

export default ReadAuthors;
