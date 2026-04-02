import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import Navbar from "./Navbar";

function Dashboard() {

  const [showSOS, setShowSOS] = useState(true);

  // fake live logs (replace later with backend data)
  const logs = [
    "12:35:08 - User is SAFE",
    "12:34:55 - Water Level High : 620",
    "12:34:45 - Distance to Obstacle : 42 cm",
    "12:34:10 - Device Connected",
    "12:33:30 - User is SAFE"
  ];

  // auto popup demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSOS(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-wrapper">
        <Navbar/>

      <h1 className="dashboard-title">
        Smart Cane Monitoring Dashboard
      </h1>

      {/* ===== STATUS CARDS ===== */}
      <div className="card-grid">

        <div className="card">
          <h3>User Status</h3>
          <div className="status-safe">SAFE</div>
        </div>

        

        <div className="card">
          <h3>Distance to Obstacle</h3>
          <p className="distance">42 cm</p>
        </div>

        <div className="card">
          <h3>Device Status</h3>
          <p className="online">
            ● ONLINE
          </p>
        </div>

      </div>

      {/* ===== LOWER SECTION ===== */}
      <div className="bottom-grid">

        {/* LOG FEED */}
        <div className="card log-card">
          <h3>Live Log Feed</h3>

          <ul>
            {logs.map((log, index) => (
              <li key={index}>✔ {log}</li>
            ))}
          </ul>
        </div>

        {/* CONNECTION */}
        <div className="card connection-card">
          <h3>Connection Status</h3>

          <p className="device-online">
            📶 Device Online
          </p>

          <p className="mqtt">
            ✅ MQTT Connected
          </p>
        </div>

      </div>

      {/* ===== SOS POPUP ===== */}
      {showSOS && (
        <div className="sos-overlay">
          <div className="sos-modal">

            <span
              className="close"
              onClick={() => setShowSOS(false)}
            >
              ✕
            </span>

            <div className="warning">⚠</div>

            <h2>EMERGENCY SOS ALERT!</h2>
            <p>SOS Button Pressed!</p>

            <button
              onClick={() => setShowSOS(false)}
            >
              OK
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;