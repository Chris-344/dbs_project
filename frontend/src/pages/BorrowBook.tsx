import axios from "axios";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface Publication {
  0: number; // PUB_ID
  1: string; // TITLE
  2: number; // YEAR
  3: string; // SOURCE
  4: number; // COPIES_AVAILABLE
}

interface Availability {
  pub_id: number;
  title: string;
  copiesAvailable: number;
  activeBorrows: number;
  availableNow: number;
  canBorrow: boolean;
}

function BorrowBook() {
  const location = useLocation();
  const [searchType, setSearchType] = useState<"title" | "author" | "publication">("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Publication[]>([]);
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search & Borrow" },
    { to: "/issue-history", label: "Issue History" },
  ];

  async function searchPublications(query: string) {
    if (!query.trim()) return;

    try {
      const res = await axios.get("http://localhost:5000/api/searchPublicationByTitle", {
        params: { title: query },
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  }

  function getAvailabilityStatus(copies: number): { status: string; badge: string } {
    if (copies > 0) {
      return { status: "Available", badge: "available" };
    }
    return { status: "Not Available", badge: "unavailable" };
  }

  async function checkAvailability(pubId: number) {
    try {
      const res = await axios.get(`http://localhost:5000/api/checkAvailability/${pubId}`);
      setAvailability(res.data);
      setSelectedPub(searchResults.find((p) => p[0] === pubId) || null);
      fetchBorrowingHistory(pubId);
      setSuccessMessage("");
    } catch (err) {
      console.error("Availability check error:", err);
    }
  }

  async function fetchBorrowingHistory(pubId: number) {
    try {
      const res = await axios.get(`http://localhost:5000/api/borrowingHistory/${pubId}`);
      setBorrowingHistory(res.data);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  }

  async function handleBorrow(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedPub || !borrowerName || !issueDate || !returnDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/borrowPublication", {
        pub_id: selectedPub[0],
        borrower_name: borrowerName,
        issue_date: issueDate,
        return_date: returnDate,
      });

      setSuccessMessage("Book borrowed successfully!");
      setBorrowerName("");
      setIssueDate("");
      setReturnDate("");
      checkAvailability(selectedPub[0]);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Borrow error:", err);
      alert("Failed to borrow book. Please check availability and try again.");
    }
  }

  return (
    <div className="page">
      <nav className="nav">
        <span className="nav-brand">ResearchDB</span>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="content">
        <div className="page-header">
          <div className="page-title">Search & Borrow</div>
          <p className="page-subtitle">
            Find publications by title and check their availability. Borrow books and track your borrowing history.
          </p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-header">
            <label htmlFor="searchType" className="search-label">
              Search Publications By
            </label>
            <span className="search-hint">Select criteria and enter your search query</span>
          </div>
          <div className="search-type-container">
            <select
              id="searchType"
              className="search-type-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "title" | "author" | "publication")}
            >
              <option value="title">📚 Title</option>
              <option value="author">👤 Author</option>
              <option value="publication">📖 Publication</option>
            </select>
            <input
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder={
                searchType === "title"
                  ? "e.g., Advanced Database Systems..."
                  : searchType === "author"
                  ? "e.g., John Smith..."
                  : "e.g., IEEE..."
              }
            />
            <button
              className="search-btn"
              onClick={() => searchPublications(searchQuery)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="table-section">
            <div className="results-header">
              <h3 className="results-title">Available Publications</h3>
              <span className="results-count">{searchResults.length} publication{searchResults.length !== 1 ? "s" : ""} found</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>Title</td>
                    <td>Year</td>
                    <td>Source</td>
                    <td>Available</td>
                    <td>Status</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((pub) => {
                    const { status, badge } = getAvailabilityStatus(pub[4]);
                    return (
                      <tr key={pub[0]}>
                        <td>{pub[0]}</td>
                        <td>{pub[1]}</td>
                        <td>{pub[2]}</td>
                        <td>{pub[3]}</td>
                        <td>
                          <div className="availability-cell">
                            {pub[4] > 0 ? (
                              <span className="copy-count">{pub[4]} copies</span>
                            ) : (
                              <span className="copy-count out-of-stock">Out of Stock</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${badge}`}>
                            {badge === "available" ? "✓ Available" : "✗ Not Available"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-btn"
                            onClick={() => checkAvailability(pub[0])}
                            disabled={pub[4] === 0}
                          >
                            {pub[4] > 0 ? "Details" : "Unavailable"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Availability & Borrowing Form */}
        {availability && (
          <div className="borrow-section">
            <div className="borrow-header">
              <h3 className="borrow-title">{availability.title}</h3>
              <div className="availability-badge">
                {availability.canBorrow ? (
                  <span className="badge-available">✓ Available ({availability.availableNow})</span>
                ) : (
                  <span className="badge-unavailable">✗ Not Available</span>
                )}
              </div>
            </div>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <div className="borrow-grid">
              {/* Availability Info */}
              <div className="availability-info">
                <h4>Book Information</h4>
                <div className="info-item">
                  <span className="info-label">Total Copies:</span>
                  <span className="info-value">{availability.copiesAvailable}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Currently Borrowed:</span>
                  <span className="info-value">{availability.activeBorrows}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Available Now:</span>
                  <span className="info-value status-available">{availability.availableNow}</span>
                </div>
              </div>

              {/* Borrow Form */}
              {availability.canBorrow && (
                <div className="borrow-form-container">
                  <h4>Borrow This Book</h4>
                  <form onSubmit={handleBorrow}>
                    <div className="form-group">
                      <label htmlFor="borrowerName">Borrower Name</label>
                      <input
                        id="borrowerName"
                        type="text"
                        value={borrowerName}
                        onChange={(e) => setBorrowerName(e.target.value)}
                        placeholder="Enter your name"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="issueDate">Issue Date</label>
                      <input
                        id="issueDate"
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="returnDate">Return Date</label>
                      <input
                        id="returnDate"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <button type="submit" className="submit-btn">
                      Borrow Book
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Borrowing History */}
            {borrowingHistory.length > 0 && (
              <div className="history-section">
                <h4>Borrowing History</h4>
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <td>Borrower</td>
                        <td>Issue Date</td>
                        <td>Return Date</td>
                        <td>Status</td>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowingHistory.slice(0, 5).map((record: any, idx: number) => (
                        <tr key={idx}>
                          <td>{record[1]}</td>
                          <td>{record[2]?.toString().split(" ")[0]}</td>
                          <td>{record[3]?.toString().split(" ")[0]}</td>
                          <td>{record[4] === 1 ? "Returned" : "Active"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BorrowBook;
