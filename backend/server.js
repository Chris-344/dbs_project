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

app.post("/api/search", async (req, res) => {
  let conn;
  const { name, institution, dept, email, address, homepage } = req.body;

  try {
    conn = await oracledb.getConnection(dbConfig);

    await conn.execute(
      `INSERT INTO authors(NAME, INSTITUTION, DEPARTMENT, EMAIL, ADDRESS, HOMEPAGE) 
   VALUES(:n, :i, :d, :e, :a, :h)`,
      { n: name, i: institution, d: dept, e: email, a: address, h: homepage },
      { autoCommit: true },
    );

    res.json({ message: "Author added" });
  } catch (e) {
    console.error(e);
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

app.get("/api/search", async (req, res) => {
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

app.get("/api/publications/search", async (req, res) => {
  let conn;
  const { title, institution, department } = req.query;

  try {
    conn = await oracledb.getConnection(dbConfig);

    let query = `
      SELECT DISTINCT 
        p.PUB_ID, p.TITLE, p.YEAR, p.SOURCE, p.PAGE_FROM, p.PAGE_TO,
        a.AUTHOR_ID, a.NAME, a.INSTITUTION, a.DEPARTMENT
      FROM PUBLICATIONS p
      LEFT JOIN AUTHOR_PUBLICATION ap ON p.PUB_ID = ap.PUB_ID
      LEFT JOIN AUTHORS a ON ap.AUTHOR_ID = a.AUTHOR_ID
      WHERE 1=1
    `;

    const bindings = {};

    if (title) {
      query += ` AND UPPER(p.TITLE) LIKE UPPER(:title)`;
      bindings.title = `%${title}%`;
    }

    if (institution) {
      query += ` AND UPPER(a.INSTITUTION) LIKE UPPER(:institution)`;
      bindings.institution = `%${institution}%`;
    }

    if (department) {
      query += ` AND UPPER(a.DEPARTMENT) LIKE UPPER(:department)`;
      bindings.department = `%${department}%`;
    }

    const result = await conn.execute(query, bindings);

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

app.listen(5000, () => console.log("Backend running on port 5000"));
