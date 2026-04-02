import { Link } from "react-router-dom";

function NavigationBar() {
  const navLinks = [
    // { to: "/", label: "Data" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Book" },
    { to: "/add-student", label: "Add Student" },
    { to: "/search-author", label: "Search Author" },
    { to: "/issue-book", label: "Issue Book" },
    { to: "/issue-history", label: "Issue history" },
  ];

  return (
    <nav className="nav">
      <span className="nav-brand">
        <Link to="/" >
          Database
        </Link>
      </span>
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
  );
}

export default NavigationBar;
