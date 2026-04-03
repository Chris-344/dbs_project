interface Props {
  issuedBooks: any[];
}

function ReadIssuedBooks({ issuedBooks }: Props) {
  const columns = [
    "Borrow ID",
    "Book ID",
    "Student ID",
    "Issue Date",
    "Return Date",
  ];
  const formatDate = (value: string | null) => {
    if (!value) return "Not Returned";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateReturnDate = (value: string | null) => {
    if (!value) return "Not Returned";
    const date = new Date(value);
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">Issued Books</div>
        {issuedBooks.length > 0 && (
          <div className="page-count">{issuedBooks.length} records</div>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issuedBooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">
                  No issued books found
                </td>
              </tr>
            ) : (
              issuedBooks.map((ele, i) => (
                <tr key={i}>
                  <td>{ele[0]}</td>
                  <td>{ele[1]}</td>
                  <td>{ele[2]}</td>
                  <td>{formatDate(ele[3])}</td>
                  <td><button>Return book</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReadIssuedBooks;
