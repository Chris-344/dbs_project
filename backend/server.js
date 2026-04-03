const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
const { endpoints } = require("./util");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

app.get(endpoints.readAuthor, async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT * from authors`);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
});

app.get(endpoints.getBooks, async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT * FROM books`);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
});

app.get(endpoints.searchAuthor, async (req, res) => {
  let conn;
  const { author } = req.query;

  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT * FROM authors WHERE UPPER(name) = UPPER(:a)`,
      { a: author },
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
});

app.post(endpoints.addAuthor, async (req, res) => {
  let conn;
  const { id, name, institution, dept, homepage, email, address } = req.body;

  // Validate required fields before hitting DB
  if (!name || !institution || !dept) {
    return res
      .status(400)
      .json({ error: "Name, institution, and department are required." });
  }

  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `INSERT INTO authors(NAME, INSTITUTION, DEPARTMENT, EMAIL, ADDRESS,HOMEPAGE) 
       VALUES(:n, :i, :d, :e, :a, :h)`,
      {
        n: name,
        i: institution,
        d: dept,
        e: email,
        a: address,
        h: homepage,
      },
      { autoCommit: true },
    );
    res.json({ message: "Author added" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
});

app.post(endpoints.addBook, async (req, res) => {
  let conn;
  const { authorId, title, year, genreId } = req.body;
  if (!authorId || !title) {
    return res.status(400).json({ error: "Author ID and title are required." });
  }
  try {
    conn = await oracledb.getConnection(dbConfig);

    // Call add_book procedure
    await conn.execute(
      `BEGIN add_book(:title, :authorId, :genreId, :year); END;`,
      {
        title: title,
        authorId: Number(authorId),
        genreId: genreId ? Number(genreId) : null,
        year: year ? Number(year) : null,
      },
      { autoCommit: true },
    );

    // Query to get the inserted book_id
    const bookResult = await conn.execute(
      `SELECT BOOK_ID FROM BOOKS WHERE TITLE = :title AND AUTHOR_ID = :authorId ORDER BY BOOK_ID DESC FETCH FIRST 1 ROW ONLY`,
      {
        title: title,
        authorId: Number(authorId),
      },
    );

    if (bookResult.rows.length > 0) {
      const bookId = bookResult.rows[0][0];

      // Call link_author_book procedure
      await conn.execute(
        `BEGIN link_author_book(:authorId, :bookId); END;`,
        {
          authorId: Number(authorId),
          bookId: bookId,
        },
        { autoCommit: true },
      );

      res.json({ message: "Book added and linked to author." });
    } else {
      res
        .status(500)
        .json({ error: "Book was added but could not retrieve the ID." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error(closeErr);
      }
    }
  }
});

app.post(endpoints.addStudent, async (req, res) => {
  let conn;
  const { id, name, email, department } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "Student ID and Name are required." });
  }

  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `BEGIN add_student(:id, :name, :email, :department); END;`,
      {
        id: Number(id),
        name: name,
        email: email || null,
        department: department || null,
      },
      { autoCommit: true },
    );
    res.json({ message: "Student added successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error(closeErr);
      }
    }
  }
});

app.post(endpoints.issueBook, async (req, res) => {
  let conn;
  const { bookId, studentId, issueDate, returnDate } = req.body;

  if (!bookId || !studentId) {
    return res
      .status(400)
      .json({ error: "Book ID and Student ID are required." });
  }

  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `BEGIN issue_book(:bookId, :studentId, :issueDate, :returnDate); END;`,
      {
        bookId: Number(bookId),
        studentId: Number(studentId),
        issueDate: issueDate || new Date(),
        returnDate: returnDate || null,
      },
      { autoCommit: true },
    );
    res.json({ message: "Book issued successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error(closeErr);
      }
    }
  }
});

app.get(endpoints.readStudent, async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT * FROM students`);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
});

app.get(endpoints.issuedBooks, async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT * FROM issued_books`);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
});

app.get(endpoints.issueHistory, async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT * FROM issue_history`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
});

app.delete(`${endpoints.issuedBooks}/:id`, async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `DELETE FROM issued_books WHERE borrow_id = :id`,
      { id: req.params.id },
      { autoCommit: true },
    );
    res.json({ message: "Book returned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));