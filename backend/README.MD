# sqlplus sys/your_admin_password@localhost:1521/XEPDB1 as sysdba

-- Create the user
CREATE USER react_user IDENTIFIED BY your_strong_password;

-- Grant permissions to connect and create objects
GRANT CONNECT, RESOURCE TO react_user;

-- Allow the user to actually store data in the tablespace
ALTER USER react_user QUOTA UNLIMITED ON USERS;

-- (Optional) Grant specific table rights
GRANT CREATE SESSION, CREATE TABLE TO react_user;