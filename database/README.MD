# Sample data

-- Authors
INSERT INTO AUTHORS (NAME, INSTITUTION, DEPARTMENT, EMAIL, HOMEPAGE, ADDRESS)
VALUES ('George Orwell', 'Secker & Warburg', 'Fiction', 'gorwell@pub.com', 'georgeorwell.org', 'London, UK');

INSERT INTO AUTHORS (NAME, INSTITUTION, DEPARTMENT, EMAIL, HOMEPAGE, ADDRESS)
VALUES ('J.K. Rowling', 'Bloomsbury', 'Fantasy', 'jkr@bloomsbury.com', 'jkrowling.com', 'Edinburgh, UK');

INSERT INTO AUTHORS (NAME, INSTITUTION, DEPARTMENT, EMAIL, HOMEPAGE, ADDRESS)
VALUES ('Yuval Noah Harari', 'Hebrew University', 'History', 'harari@huji.ac.il', 'ynharari.com', 'Jerusalem, IL');

COMMIT;

-- Students
INSERT INTO STUDENTS (STUDENT_ID, NAME, EMAIL, DEPARTMENT)
VALUES (1001, 'Alice Mendes', 'alice@uni.edu', 'Computer Science');

INSERT INTO STUDENTS (STUDENT_ID, NAME, EMAIL, DEPARTMENT)
VALUES (1002, 'Bob Tanner', 'bob@uni.edu', 'Literature');

INSERT INTO STUDENTS (STUDENT_ID, NAME, EMAIL, DEPARTMENT)
VALUES (1003, 'Carol Singh', 'carol@uni.edu', 'History');

COMMIT;

-- Genres (inserting directly first so books can reference them)
INSERT INTO GENRES (GENRE_NAME) VALUES ('Dystopian');
INSERT INTO GENRES (GENRE_NAME) VALUES ('Fantasy');
INSERT INTO GENRES (GENRE_NAME) VALUES ('Non-Fiction');

COMMIT;

-- Books (assumes authors got IDs 1, 2, 3 in order; adjust if yours differ)
BEGIN add_book('1984',                                      1, 1, 1949); END;
/
BEGIN add_book('Animal Farm',                               1, 1, 1945); END;
/
BEGIN add_book('Harry Potter and the Philosophers Stone',   2, 2, 1997); END;
/
BEGIN add_book('Sapiens',                                   3, 3, 2011); END;
/

-- Link authors to books via the junction table
-- (assumes books got IDs 1, 2, 3, 4 in order)
BEGIN link_author_book(1, 1); END;
/
BEGIN link_author_book(1, 2); END;
/
BEGIN link_author_book(2, 3); END;
/
BEGIN link_author_book(3, 4); END;
/

-- Issue books to students
BEGIN issue_book(1, 1001, DATE '2026-04-01', NULL); END;
/
BEGIN issue_book(3, 1002, DATE '2026-04-02', NULL); END;
/
BEGIN issue_book(4, 1003, DATE '2026-04-03', NULL); END;
/