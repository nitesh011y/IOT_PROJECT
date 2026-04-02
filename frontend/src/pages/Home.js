import "./../styles/home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  // get logged user
  const navigate = useNavigate();

const storedUser = JSON.parse(localStorage.getItem("user"));
const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="home-wrapper">

      {/* ===== NAVBAR ===== */}
      <nav className="navbar"> 

        <div className="logo">
          SmartCane
        </div>

        <div className="nav-links">

  <button
    className="nav-btn"
    onClick={() => navigate("/dashboard")}
  >
    Dashboard
  </button>

    <button className="nav-btn">Notifications</button>


</div>

        <div className="user-section">

  <div
    className="user-icon"
    onClick={() => setShowMenu(!showMenu)}
  >
    {storedUser?.name?.charAt(0).toUpperCase() || "U"}
  </div>

  {showMenu && (
    <div className="user-dropdown">
      <p>{storedUser?.name}</p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  )}

</div>

      </nav>


      {/* ===== HOME CONTENT ===== */}
      <div className="home-content">

        <h1>Smart Cane Detection System</h1>

        <p>
          The Smart Cane is an IoT-based assistive device designed to help
          visually impaired individuals navigate safely and independently.
          Using advanced sensors and real-time alerts, the system detects
          nearby obstacles, water puddles, and emergency situations.
        </p>

        <p>
          The cane integrates ultrasonic sensors, water detection modules,
          vibration motors, and cloud connectivity to provide intelligent
          feedback to the user. Notifications and live system status are
          available through a web dashboard.
        </p>

        <div className="features">

          <div className="feature-card">
            <h3>Obstacle Detection</h3>
            <p>
              Detects objects in front of the user using ultrasonic sensing
              technology and alerts through vibration feedback.
            </p>
          </div>

          <div className="feature-card">
            <h3>Water Detection</h3>
            <p>
              Identifies wet surfaces or puddles to prevent slips and
              improve outdoor safety.
            </p>
          </div>

          <div className="feature-card">
            <h3>SOS Emergency</h3>
            <p>
              Emergency alert system sends notifications instantly when
              assistance is required.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;