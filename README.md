# Library issue system
A project that can be used to add and retrieve information about books

## Tech Stack

It is written in:

1. React
2. Node/Express
3. Pl/Sql

## Running the project

To run the project make sure to enter each folder using cd and run run "npm i" for backend and frontend
and for database you have to set it up

## TODO
make student,issued_books,book,section, tables
make relations between publications,book,research paper,borrow instance,student

have a page to issue books by logging student_id, return_date, book_id
doing this would make the book unavailable to issue till return

have a category table that is there to hold genre like scifi,horror
have a table issued books that will store the books that are currently issued
have a table to store the history of the books issued

the issue section will have dropdowns that will only show Students who have less than 3 books issued

this will create 6 tables

## Project Structure
tables student,issued_books,books,authors,