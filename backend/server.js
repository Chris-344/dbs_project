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

app.get("/api/searchAuthorByName", async (req, res) => {
  let conn;
  const { author } = req.query;

  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT * FROM authors WHERE UPPER(name) = UPPER(:a)`,
      { a: author }
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

app.get("/api/searchPublicationByTitle", async (req, res) => {
  let conn;
  const { title } = req.query;

  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT * FROM publications WHERE UPPER(title) LIKE UPPER(:t)`,
      { t: `%${title}%` }
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

app.post("/api/borrowPublication", async (req, res) => {
  let conn;
  const { pub_id, borrower_name, issue_date, return_date } = req.body;

  try {
    conn = await oracledb.getConnection(dbConfig);
    
    // Check availability
    const availResult = await conn.execute(
      `SELECT GET_PUBLICATION_AVAILABILITY(:pub_id) as available FROM DUAL`,
      { pub_id }
    );
    
    const available = availResult.rows[0][0];
    
    if (available <= 0) {
      return res.status(400).json({ error: "Book not available for borrowing" });
    }

    // Record borrow
    await conn.execute(
      `INSERT INTO borrowing (PUB_ID, BORROWER_NAME, ISSUE_DATE, RETURN_DATE) 
       VALUES (:pub_id, :borrower_name, TO_DATE(:issue_date, 'YYYY-MM-DD'), TO_DATE(:return_date, 'YYYY-MM-DD'))`,
      { 
        pub_id, 
        borrower_name, 
        issue_date,
        return_date 
      },
      { autoCommit: true }
    );

    res.json({ message: "Publication borrowed successfully", available: available - 1 });
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

app.get("/api/checkAvailability/:pubId", async (req, res) => {
  let conn;
  const { pubId } = req.params;

  try {
    conn = await oracledb.getConnection(dbConfig);
    
    const result = await conn.execute(
      `SELECT 
        p.PUB_ID, 
        p.TITLE, 
        p.COPIES_AVAILABLE,
        (SELECT COUNT(*) FROM BORROWING WHERE PUB_ID = :pubId AND RETURNED = 0 AND TRUNC(RETURN_DATE) >= TRUNC(SYSDATE)) as ACTIVE_BORROWS
       FROM PUBLICATIONS p 
       WHERE p.PUB_ID = :pubId`,
      { pubId }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Publication not found" });
    }

    const pub = result.rows[0];
    const available = pub[2] - pub[3]; // COPIES_AVAILABLE - ACTIVE_BORROWS

    res.json({
      pub_id: pub[0],
      title: pub[1],
      copiesAvailable: pub[2],
      activeBorrows: pub[3],
      availableNow: available,
      canBorrow: available > 0
    });
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

app.get("/api/borrowingHistory/:pubId", async (req, res) => {
  let conn;
  const { pubId } = req.params;

  try {
    conn = await oracledb.getConnection(dbConfig);
    
    const result = await conn.execute(
      `SELECT BORROW_ID, BORROWER_NAME, ISSUE_DATE, RETURN_DATE, RETURNED 
       FROM BORROWING 
       WHERE PUB_ID = :pubId
       ORDER BY ISSUE_DATE DESC`,
      { pubId }
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

app.post("/api/addPublication", async (req, res) => {
  let conn;
  const { authorId, title, year, source, copiesAvailable = 1 } = req.body;

  try {
    conn = await oracledb.getConnection(dbConfig);

    // Insert publication
    const pubResult = await conn.execute(
      `INSERT INTO publications (TITLE, YEAR, SOURCE, COPIES_AVAILABLE)
       VALUES (:title, :year, :source, :copies)
       RETURNING PUB_ID INTO :pub_id`,
      {
        title,
        year: parseInt(year) || null,
        source,
        copies: copiesAvailable,
        pub_id: new oracledb.OutParam(oracledb.DB_TYPE_NUMBER),
      },
      { autoCommit: true }
    );

    const pubId = pubResult.outBinds.pub_id[0];

    // Link author to publication if authorId provided
    if (authorId) {
      await conn.execute(
        `INSERT INTO author_publication (AUTHOR_ID, PUB_ID)
         VALUES (:authorId, :pubId)`,
        { authorId: parseInt(authorId), pubId },
        { autoCommit: true }
      );
    }

    res.json({ message: "Publication added successfully", pubId });
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

// ══════════════════════════════════════════════════════════════
// CATEGORIES ENDPOINTS
// ══════════════════════════════════════════════════════════════

app.get("/api/categories", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT CATEGORY_ID, CATEGORY_NAME, DESCRIPTION FROM CATEGORIES ORDER BY CATEGORY_NAME`
    );
    res.json(result.rows.map(row => ({
      categoryId: row[0],
      categoryName: row[1],
      description: row[2]
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.post("/api/addCategory", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const { categoryName, description } = req.body;
    
    const result = await conn.execute(
      `INSERT INTO CATEGORIES (CATEGORY_NAME, DESCRIPTION) VALUES (:name, :desc)
       RETURNING CATEGORY_ID INTO :id`,
      { 
        name: categoryName, 
        desc: description,
        id: new oracledb.OutParam(oracledb.DB_TYPE_NUMBER)
      },
      { autoCommit: true }
    );
    
    res.json({ message: "Category added", categoryId: result.outBinds.id[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ══════════════════════════════════════════════════════════════
// PUBLISHERS ENDPOINTS
// ══════════════════════════════════════════════════════════════

app.get("/api/publishers", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT PUBLISHER_ID, NAME, LOCATION, EMAIL, PHONE FROM PUBLISHERS ORDER BY NAME`
    );
    res.json(result.rows.map(row => ({
      publisherId: row[0],
      name: row[1],
      location: row[2],
      email: row[3],
      phone: row[4]
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.post("/api/addPublisher", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const { name, location, email, phone } = req.body;
    
    const result = await conn.execute(
      `INSERT INTO PUBLISHERS (NAME, LOCATION, EMAIL, PHONE) VALUES (:name, :loc, :email, :phone)
       RETURNING PUBLISHER_ID INTO :id`,
      { 
        name, 
        loc: location,
        email,
        phone,
        id: new oracledb.OutParam(oracledb.DB_TYPE_NUMBER)
      },
      { autoCommit: true }
    );
    
    res.json({ message: "Publisher added", publisherId: result.outBinds.id[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ══════════════════════════════════════════════════════════════
// STUDENTS ENDPOINTS
// ══════════════════════════════════════════════════════════════

app.get("/api/students", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT STUDENT_ID, NAME, EMAIL, DEPARTMENT FROM STUDENTS ORDER BY NAME`
    );
    res.json(result.rows.map(row => ({
      studentId: row[0],
      name: row[1],
      email: row[2],
      department: row[3]
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.post("/api/addStudent", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const { name, email, department } = req.body;
    
    const result = await conn.execute(
      `INSERT INTO STUDENTS (NAME, EMAIL, DEPARTMENT) VALUES (:name, :email, :dept)
       RETURNING STUDENT_ID INTO :id`,
      { 
        name, 
        email,
        dept: department,
        id: new oracledb.OutParam(oracledb.DB_TYPE_NUMBER)
      },
      { autoCommit: true }
    );
    
    res.json({ message: "Student added", studentId: result.outBinds.id[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ══════════════════════════════════════════════════════════════
// ENHANCED PUBLICATION ENDPOINTS (WITH CATEGORY & PUBLISHER)
// ══════════════════════════════════════════════════════════════

app.get("/api/publicationDetails", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT * FROM PUBLICATION_DETAILS ORDER BY PUB_ID DESC`
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ══════════════════════════════════════════════════════════════
// REVIEWS ENDPOINTS
// ══════════════════════════════════════════════════════════════

app.get("/api/reviews/:pubId", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const { pubId } = req.params;
    
    const result = await conn.execute(
      `SELECT REVIEW_ID, PUB_ID, RATING, COMMENT, REVIEW_DATE FROM REVIEWS 
       WHERE PUB_ID = :pubId ORDER BY REVIEW_DATE DESC`,
      { pubId }
    );
    
    res.json(result.rows.map(row => ({
      reviewId: row[0],
      pubId: row[1],
      rating: row[2],
      comment: row[3],
      reviewDate: row[4]
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.post("/api/addReview", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const { pubId, studentId, rating, comment } = req.body;
    
    const result = await conn.execute(
      `INSERT INTO REVIEWS (PUB_ID, STUDENT_ID, RATING, COMMENT) 
       VALUES (:pubId, :studentId, :rating, :comment)
       RETURNING REVIEW_ID INTO :id`,
      { 
        pubId,
        studentId,
        rating: parseFloat(rating),
        comment,
        id: new oracledb.OutParam(oracledb.DB_TYPE_NUMBER)
      },
      { autoCommit: true }
    );
    
    res.json({ message: "Review added", reviewId: result.outBinds.id[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ══════════════════════════════════════════════════════════════
// STATISTICS & ANALYTICS (GROUP BY queries for academic evaluation)
// ══════════════════════════════════════════════════════════════

app.get("/api/statistics/categoryStats", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT * FROM CATEGORY_STATISTICS ORDER BY BOOK_COUNT DESC`
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.get("/api/statistics/studentStats", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT * FROM STUDENT_BORROWING_HISTORY ORDER BY TOTAL_BORROWS DESC`
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.get("/api/statistics/borrowingStats", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    
    // Most borrowed books (GROUP BY with COUNT)
    const mostBorrowedResult = await conn.execute(
      `SELECT p.PUB_ID, p.TITLE, c.CATEGORY_NAME, COUNT(b.BORROW_ID) as BORROW_COUNT
       FROM PUBLICATIONS p
       LEFT JOIN BORROWING b ON p.PUB_ID = b.PUB_ID
       LEFT JOIN CATEGORIES c ON p.CATEGORY_ID = c.CATEGORY_ID
       GROUP BY p.PUB_ID, p.TITLE, c.CATEGORY_NAME
       ORDER BY BORROW_COUNT DESC`
    );
    
    // Overall stats
    const statsResult = await conn.execute(
      `SELECT 
        (SELECT COUNT(*) FROM BORROWING WHERE RETURNED = 0) as ACTIVE_BORROWS,
        (SELECT COUNT(*) FROM BORROWING WHERE RETURNED = 0 AND TRUNC(RETURN_DATE) < TRUNC(SYSDATE)) as OVERDUE_COUNT,
        (SELECT COUNT(DISTINCT PUB_ID) FROM PUBLICATIONS) as TOTAL_PUBLICATIONS,
        (SELECT COUNT(DISTINCT STUDENT_ID) FROM STUDENTS) as TOTAL_STUDENTS
       FROM DUAL`
    );
    
    res.json({
      mostBorrowed: mostBorrowedResult.rows,
      overallStats: {
        activeBorrows: statsResult.rows[0][0],
        overdueCount: statsResult.rows[0][1],
        totalPublications: statsResult.rows[0][2],
        totalStudents: statsResult.rows[0][3]
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.get("/api/statistics/borrowingDetails", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT * FROM BORROWING_DETAILS ORDER BY DAYS_FROM_DUE DESC`
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    if (conn) await conn.close();
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
