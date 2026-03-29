import ReadAuthors from "./components/ReadAuthors";
import ReadPublication from "./components/ReadPublications";
import { Link, useLocation } from "react-router-dom";

function DisplayData() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search & Borrow" },
    { to: "/issue-history", label: "Issue History" },
  ];

  return (
    <>
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
        <div className="content-header-section">
          <div className="page-header">
            <div className="page-title">Authors & Publications</div>
            <p className="page-subtitle">Manage and view all registered authors and their publications in the system.</p>
          </div>
        </div>
        <ReadAuthors />
        <ReadPublication />
      </div>
    </>
  );
}

export default DisplayData;
