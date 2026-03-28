import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  return (
    <>
      <Link to="/">Read Authors</Link>{" "}
      <Link to="/add-publication">Add Publication</Link>{" "}
      <Link to="/add-author">Add Authors</Link>
      <table border={3}>
        <tr>
          <td>id</td>
          <td>name</td>
          <td>institution</td>
          <td>dept</td>
          <td>mail</td>
          <td>address</td>
          <td>homepage</td>
        </tr>
        {authors.map((ele) => {
          console.log(typeof ele, ele);
          return (
            <tr>
              <td>{ele[0]}</td>
              <td>{ele[1]}</td>
              <td>{ele[2]}</td>
              <td>{ele[3]}</td>
              <td>{ele[4]}</td>
              <td>{ele[5]}</td>
              <td>{ele[6]}</td>
            </tr>
          );
        })}
      </table>
    </>
  );
}

export default ReadAuthors;
