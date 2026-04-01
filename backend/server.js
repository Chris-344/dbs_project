const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

app.get("/api/authors", async (req, res) => {
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

app.get("/api/publications", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT * FROM publications`);

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

app.get("/api/searchAuthorByName", async (req, res) => {
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

app.post("/api/addAuthor", async (req, res) => {
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
      `INSERT INTO authors(AUTHOR_ID,NAME, INSTITUTION, DEPARTMENT, EMAIL, ADDRESS,HOMEPAGE) 
       VALUES(:id,:n, :i, :d, :e, :a, :h)`,
      {
        id: id,
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
app.post("/api/addPublication", async (req, res) => {
  let conn;
  const { authorId, title, year, source } = req.body;
  if (!authorId || !title) {
    return res.status(400).json({ error: "Author ID and title are required." });
  }
  try {
    conn = await oracledb.getConnection(dbConfig);
    const pubResult = await conn.execute(
      `INSERT INTO publications(title, year, source) 
       VALUES(:t, :y, :s) 
       RETURNING pub_id INTO :pubId`,
      {
        t: title,
        y: year ?? null,
        s: source ?? null,
        pubId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: false },
    );
    const pubId = pubResult.outBinds.pubId[0];
    await conn.execute(
      `INSERT INTO author_publication(author_id, pub_id) VALUES(:a, :p)`,
      { a: Number(authorId), p: pubId },
      { autoCommit: false },
    );
    await conn.commit();
    res.json({ message: "Publication added and linked to author." });
  } catch (e) {
    console.error(e);
    if (conn) {
      try {
        await conn.rollback();
      } catch (rollbackErr) {
        console.error("Rollback error:", rollbackErr);
      }
    }
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

app.listen(5000, () => console.log("Backend running on port 5000"));
