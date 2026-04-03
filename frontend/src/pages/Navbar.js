import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        {/* LEFT LOGO */}
        <div className="logo">SmartCane</div>

        {/* CENTER LINKS */}
        <div className="nav-links">
          <Link to="/home" className="nav-link">
            Home
          </Link>

          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          <Link to="/history" className="nav-link">
            History
          </Link>

          <Link to="/analytics" className="nav-link">
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
    </>
  );
}

export default Navbar;
