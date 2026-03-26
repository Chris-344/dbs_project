const express=require('express')
const cors=require("cors")
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());


const dbConfig = {
  user: "SYSTEM",
  password: "asdf",
  connectString: "localhost:1521/XEPDB1"
};

app.post("/api/authors", async (req, res) => {
  const { name, institution, department, email, address, homepage } = req.body;

  try {
    const conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `BEGIN ADD_AUTHOR(:n, :i, :d, :e, :a, :h, :id); END;`,
      {
        n: name,
        i: institution,
        d: department,
        e: email,
        a: address,
        h: homepage,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    await conn.close();
    res.json({ author_id: result.outBinds.id });
  } catch (err) {
    res.status(500).send(err);
  }
});

// ✅ Add Publication
app.post("/api/publications", async (req, res) => {
  const { title, year, source, pageFrom, pageTo } = req.body;

  try {
    const conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `BEGIN ADD_PUBLICATION(:t, :y, :s, :p1, :p2, :id); END;`,
      {
        t: title,
        y: year,
        s: source,
        p1: pageFrom,
        p2: pageTo,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    await conn.close();
    res.json({ pub_id: result.outBinds.id });
  } catch (err) {
    res.status(500).send(err);
  }
});

// ✅ Link author & publication
app.post("/api/link", async (req, res) => {
  const { author_id, pub_id } = req.body;

  try {
    const conn = await oracledb.getConnection(dbConfig);

    await conn.execute(
      `BEGIN LINK_AUTHOR_PUBLICATION(:a, :p); END;`,
      { a: author_id, p: pub_id }
    );

    await conn.commit();
    await conn.close();
    res.send("Linked successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// ✅ Search Publications
app.get("/api/search", async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `SELECT * FROM PUBLICATIONS WHERE LOWER(TITLE) LIKE LOWER('%' || :kw || '%')`,
      [keyword]
    );

    await conn.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
