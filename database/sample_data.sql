-- Authors
BEGIN add_author('George Orwell', 'Secker & Warburg', 'Fiction', 'gorwell@pub.com', 'georgeorwell.org', 'London, UK'); END;
/
BEGIN add_author('J.K. Rowling', 'Bloomsbury', 'Fantasy', 'jkr@bloomsbury.com', 'jkrowling.com', 'Edinburgh, UK'); END;
/
BEGIN add_author('Yuval Noah Harari', 'Hebrew University', 'History', 'harari@huji.ac.il', 'ynharari.com', 'Jerusalem, IL'); END;
/
BEGIN add_author('Agatha Christie', 'HarperCollins', 'Mystery', 'agatha@hc.com', 'agathachristie.com', 'Devon, UK'); END;
/
BEGIN add_author('J.R.R. Tolkien', 'Allen & Unwin', 'Fantasy', 'tolkien@oxford.ac.uk', 'tolkiensociety.org', 'Oxford, UK'); END;
/

-- Check author IDs before continuing
SELECT AUTHOR_ID, NAME FROM AUTHORS ORDER BY AUTHOR_ID;

-- Students
BEGIN add_student(1001, 'Alice Mendes', 'alice@uni.edu', 'Computer Science'); END;
/
BEGIN add_student(1002, 'Bob Tanner', 'bob@uni.edu', 'Literature'); END;
/
BEGIN add_student(1003, 'Carol Singh', 'carol@uni.edu', 'History'); END;
/
BEGIN add_student(1004, 'David Park', 'david@uni.edu', 'Philosophy'); END;
/
BEGIN add_student(1005, 'Eva Turner', 'eva@uni.edu', 'Physics'); END;
/

-- Genres (direct insert since add_genre needs a book_id)
INSERT INTO GENRE (CATEGORY_NAME) VALUES ('Dystopian');
INSERT INTO GENRE (CATEGORY_NAME) VALUES ('Fantasy');
INSERT INTO GENRE (CATEGORY_NAME) VALUES ('Non-Fiction');
INSERT INTO GENRE (CATEGORY_NAME) VALUES ('Mystery');
INSERT INTO GENRE (CATEGORY_NAME) VALUES ('Adventure');
COMMIT;

-- Check genre IDs
SELECT GENRE_ID, CATEGORY_NAME FROM GENRE ORDER BY GENRE_ID;

-- Books (Author IDs: Orwell=1, Rowling=2, Harari=3, Christie=4, Tolkien=5)
--        (Genre IDs:  Dystopian=1, Fantasy=2, Non-Fiction=3, Mystery=4, Adventure=5)

BEGIN add_book('1984',                                    1, 1, 1949); END;
/
BEGIN add_book('Animal Farm',                             1, 1, 1945); END;
/
BEGIN add_book('Homage to Catalonia',                     1, 3, 1938); END;
/
BEGIN add_book('Harry Potter and the Philosophers Stone', 2, 2, 1997); END;
/
BEGIN add_book('Harry Potter and the Chamber of Secrets', 2, 2, 1998); END;
/
BEGIN add_book('Harry Potter and the Prisoner of Azkaban',2, 2, 1999); END;
/
BEGIN add_book('Sapiens',                                 3, 3, 2011); END;
/
BEGIN add_book('Homo Deus',                               3, 3, 2015); END;
/
BEGIN add_book('21 Lessons for the 21st Century',         3, 3, 2018); END;
/
BEGIN add_book('Murder on the Orient Express',            4, 4, 1934); END;
/
BEGIN add_book('And Then There Were None',                4, 4, 1939); END;
/
BEGIN add_book('Death on the Nile',                       4, 4, 1937); END;
/
BEGIN add_book('The Hobbit',                              5, 2, 1937); END;
/
BEGIN add_book('The Fellowship of the Ring',              5, 2, 1954); END;
/
BEGIN add_book('The Two Towers',                          5, 2, 1954); END;
/

-- Link authors to books (assumes book IDs 1-15 in order)
BEGIN link_author_book(1, 1);  END;
/
BEGIN link_author_book(1, 2);  END;
/
BEGIN link_author_book(1, 3);  END;
/
BEGIN link_author_book(2, 4);  END;
/
BEGIN link_author_book(2, 5);  END;
/
BEGIN link_author_book(2, 6);  END;
/
BEGIN link_author_book(3, 7);  END;
/
BEGIN link_author_book(3, 8);  END;
/
BEGIN link_author_book(3, 9);  END;
/
BEGIN link_author_book(4, 10); END;
/
BEGIN link_author_book(4, 11); END;
/
BEGIN link_author_book(4, 12); END;
/
BEGIN link_author_book(5, 13); END;
/
BEGIN link_author_book(5, 14); END;
/
BEGIN link_author_book(5, 15); END;
/

-- Issue some books to students
BEGIN issue_book(1,  1001, DATE '2026-03-01', NULL); END;
/
BEGIN issue_book(4,  1002, DATE '2026-03-05', NULL); END;
/
BEGIN issue_book(7,  1003, DATE '2026-03-10', NULL); END;
/
BEGIN issue_book(10, 1004, DATE '2026-03-15', NULL); END;
/
BEGIN issue_book(13, 1005, DATE '2026-03-20', NULL); END;
/