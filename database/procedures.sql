-- Procedure to add a new author
CREATE OR REPLACE PROCEDURE add_author(
    p_name IN VARCHAR2,
    p_institution IN VARCHAR2 DEFAULT NULL,
    p_department IN VARCHAR2 DEFAULT NULL,
    p_email IN VARCHAR2 DEFAULT NULL,
    p_homepage IN VARCHAR2 DEFAULT NULL,
    p_address IN VARCHAR2 DEFAULT NULL
) AS
BEGIN
    INSERT INTO AUTHORS (NAME, INSTITUTION, DEPARTMENT, EMAIL, HOMEPAGE, ADDRESS)
    VALUES (p_name, p_institution, p_department, p_email, p_homepage, p_address);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Author added successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END add_author;
/

-- Procedure to add a new book
CREATE OR REPLACE PROCEDURE add_book(
    p_title IN VARCHAR2,
    p_author_id IN NUMBER,
    p_genre_id IN NUMBER,
    p_year IN NUMBER DEFAULT NULL
) AS
BEGIN
    INSERT INTO BOOKS (TITLE, AUTHOR_ID, GENRE_ID, YEAR)
    VALUES (p_title, p_author_id, p_genre_id, p_year);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Book added successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END add_book;
/

-- Procedure to add a new student
CREATE OR REPLACE PROCEDURE add_student(
    p_name IN VARCHAR2,
    p_email IN VARCHAR2 DEFAULT NULL,
    p_department IN VARCHAR2 DEFAULT NULL
) AS
BEGIN
    INSERT INTO STUDENTS (NAME, EMAIL, DEPARTMENT)
    VALUES (p_name, p_email, p_department);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Student added successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END add_student;
/

-- Procedure to issue a book to a student
CREATE OR REPLACE PROCEDURE issue_book(
    p_book_id IN NUMBER,
    p_student_id IN NUMBER,
    p_issue_date IN DATE DEFAULT SYSDATE,
    p_return_date IN DATE DEFAULT NULL
) AS
    v_count NUMBER;
BEGIN
    -- Check if the book is already issued (not yet returned)
    SELECT COUNT(*) INTO v_count
    FROM ISSUED_BOOKS
    WHERE BOOK_ID = p_book_id
    AND RETURN_DATE IS NULL;
    
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Book is already issued and has not been returned');
    END IF;
    
    INSERT INTO ISSUED_BOOKS (BOOK_ID, STUDENT_ID, ISSUE_DATE, RETURN_DATE)
    VALUES (p_book_id, p_student_id, p_issue_date, p_return_date);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Book issued successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END issue_book;
/

-- Procedure to link an author with a book
CREATE OR REPLACE PROCEDURE link_author_book(
    p_author_id IN NUMBER,
    p_book_id IN NUMBER
) AS
BEGIN
    INSERT INTO AUTHOR_BOOK (AUTHOR_ID, BOOK_ID)
    VALUES (p_author_id, p_book_id);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Author linked to book successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END link_author_book;
/

-- Procedure to return a book (delete from issued_books)
CREATE OR REPLACE PROCEDURE return_book(
    p_book_id IN NUMBER
) AS
    v_count NUMBER;
BEGIN
    -- Check if the book is currently issued
    SELECT COUNT(*) INTO v_count
    FROM ISSUED_BOOKS
    WHERE BOOK_ID = p_book_id
    AND RETURN_DATE IS NULL;
    
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'No active issue record found for this book');
    END IF;
    
    DELETE FROM ISSUED_BOOKS
    WHERE BOOK_ID = p_book_id
    AND RETURN_DATE IS NULL;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Book returned successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END return_book;
/
