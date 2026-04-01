import { Link } from "react-router-dom";

function NavigationBar() {
  const navLinks = [
    { to: "/", label: "Authors" },
    { to: "/add-author", label: "Add Author" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-author", label: "Search Author" },
  ];

  return (
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
  );
}

export default NavigationBar;
