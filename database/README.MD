# Login to admin
sqlplus sys/your_admin_password@localhost:1521/XEPDB1 as sysdba

## Create the user
CREATE USER react_user_final IDENTIFIED BY qwerty;

## Grant permissions to connect and create objects
GRANT CONNECT, RESOURCE TO react_user_final;

## Allow the user to actually store data in the tablespace
ALTER USER react_user_final QUOTA UNLIMITED ON USERS;

## (Optional) Grant specific table rights
GRANT CREATE SESSION, CREATE TABLE TO react_user_final;

## login to the new user
sqlplus react_user_final/qwerty@localhost:1521/XEPDB1

# remove a user 
 Run this in SQL*Plus or SQL Developer as SYSTEM or SYS:
DROP USER username CASCADE;

CASCADE is important — it drops all objects (tables, procedures, sequences) owned by that user along with it. Without it, Oracle will throw an error if the user has any objects.

To see all users first:
sql

SELECT USERNAME FROM DBA_USERS ORDER BY USERNAME;

To see only the non-system users (the ones you likely created):
sql

SELECT USERNAME FROM DBA_USERS 
WHERE ACCOUNT_STATUS = 'OPEN'
AND USERNAME NOT IN ('SYS','SYSTEM','DBSNMP','APPQOSSYS','CTXSYS','XDB','ANONYMOUS');
