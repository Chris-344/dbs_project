const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "KRIS",
  password: "qwerty",
  connectString: "DESKTOP-5BKSE67:1521/XEPDB1",
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

app.listen(5000, () => console.log("Backend running on port 5000"));
