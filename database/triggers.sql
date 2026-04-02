-- Trigger to log book issue history
CREATE OR REPLACE TRIGGER issue_history_log
AFTER INSERT ON ISSUED_BOOKS
FOR EACH ROW
BEGIN
    INSERT INTO ISSUE_HISTORY (BOOK_ID, STUDENT_ID)
    VALUES (:NEW.BOOK_ID, :NEW.STUDENT_ID);
    
    DBMS_OUTPUT.PUT_LINE('Issue history logged for Student ID: ' || :NEW.STUDENT_ID || ' Book ID: ' || :NEW.BOOK_ID);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error logging issue history: ' || SQLERRM);
END issue_history_log;
/
