import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface BorrowRecord {
  borrowId: number;
  pubId: number;
  title: string;
  borrowerName: string;
  issueDate: string;
  returnDate: string;
  returned: number;
}

function IssueHistory() {
  const location = useLocation();
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "returned" | "overdue">("all");

  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search & Borrow" },
    { to: "/issue-history", label: "Issue History" },
  ];

  useEffect(() => {
    fetchAllHistory();
  }, []);

  async function fetchAllHistory() {
    try {
      setLoading(true);
      // Fetch history from all publications
      const res = await axios.get("http://localhost:5000/api/allBorrowHistory");
      setHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      // If endpoint doesn't exist, show empty state
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  function getRecordStatus(record: BorrowRecord): "returned" | "active" | "overdue" {
    if (record.returned === 1) return "returned";
    const returnDate = new Date(record.returnDate);
    const today = new Date();
    return returnDate < today ? "overdue" : "active";
  }

  function getStatusBadge(status: "returned" | "active" | "overdue") {
    switch (status) {
      case "returned":
        return <span className="badge badge-returned">✓ Returned</span>;
      case "active":
        return <span className="badge badge-active">📅 Active</span>;
      case "overdue":
        return <span className="badge badge-overdue">⚠ Overdue</span>;
    }
  }

  const filteredHistory = filterStatus === "all" 
    ? history 
    : history.filter(record => {
        const status = getRecordStatus(record);
        return status === filterStatus;
      });

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
          <div className="page-title">Issue History</div>
          <p className="page-subtitle">
            View all book borrowing records, including active borrows, returned books, and overdue items.
          </p>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-label">Filter by Status:</div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              All Records {history.length > 0 && `(${history.length})`}
            </button>
            <button
              className={`filter-btn ${filterStatus === "active" ? "active" : ""}`}
              onClick={() => setFilterStatus("active")}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filterStatus === "returned" ? "active" : ""}`}
              onClick={() => setFilterStatus("returned")}
            >
              Returned
            </button>
            <button
              className={`filter-btn ${filterStatus === "overdue" ? "active" : ""}`}
              onClick={() => setFilterStatus("overdue")}
            >
              Overdue
            </button>
          </div>
        </div>

        {/* History Table */}
        {loading ? (
          <div className="empty-content">
            <div className="empty-icon">📚</div>
            <div className="empty-title">Loading Issue History</div>
            <div className="empty-message">Please wait while we fetch your borrowing records...</div>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="table-section">
            <div className="results-header">
              <h3 className="results-title">
                {filterStatus === "all" ? "All" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Borrowing Records
              </h3>
              <span className="results-count">{filteredHistory.length} record{filteredHistory.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <td>Borrower Name</td>
                    <td>Book Title</td>
                    <td>Issue Date</td>
                    <td>Return Date</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((record) => {
                    const status = getRecordStatus(record);
                    return (
                      <tr key={record.borrowId} className={`row-${status}`}>
                        <td>{record.borrowerName}</td>
                        <td className="title-cell">{record.title}</td>
                        <td>{new Date(record.issueDate).toLocaleDateString()}</td>
                        <td>{new Date(record.returnDate).toLocaleDateString()}</td>
                        <td>{getStatusBadge(status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-content">
            <div className="empty-icon">📖</div>
            <div className="empty-title">No Issue Records</div>
            <div className="empty-message">
              {filterStatus === "all"
                ? "No borrowing records found. Start by searching and borrowing a book!"
                : `No ${filterStatus} borrowing records found.`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueHistory;
