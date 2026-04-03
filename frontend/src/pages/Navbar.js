import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNavLinks, setShowNavLinks] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="logo">SmartCane</div>

      {/* HAMBURGER (MOBILE) */}
      <div className="hamburger" onClick={() => setShowNavLinks(!showNavLinks)}>
        ☰
      </div>

      {/* CENTER LINKS */}
      <div className={`nav-links ${showNavLinks ? "active" : ""}`}>
        <Link
          to="/home"
          className="nav-link"
          onClick={() => setShowNavLinks(false)}
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="nav-link"
          onClick={() => setShowNavLinks(false)}
        >
          Dashboard
        </Link>
        <Link
          to="/history"
          className="nav-link"
          onClick={() => setShowNavLinks(false)}
        >
          History
        </Link>
        <Link
          to="/analytics"
          className="nav-link"
          onClick={() => setShowNavLinks(false)}
        >
          Analytics
        </Link>
      </div>

      {/* RIGHT USER */}
      <div className="user-section">
        <div className="user-icon" onClick={() => setShowMenu(!showMenu)}>
          {storedUser?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        {showMenu && (
          <div className="user-dropdown">
            <p>{storedUser?.name}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
