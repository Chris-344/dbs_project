const endpoints = {
  addAuthor: "/api/addAuthor",
  readAuthor: "/api/authors",
  searchAuthor: "/api/searchAuthorByName",

  addBook: "/api/addBooks",
  getBooks: "/api/books",

  issueBook: "/api/issueBook",
  issuedBooks: "/api/issuedBooks",

  addStudent: "/api/addStudent",
  readStudent:"/api/readStudent",

  issueHistory:"/api/issuedHistory"
};

module.exports = { endpoints };
