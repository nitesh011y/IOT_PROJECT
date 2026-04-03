import React, { useState } from "react";
import "../styles/home.css";
import "../styles/notification.css";
import Navbar from "./Navbar";

const Home = () => {
  /* ---------------- STATES ---------------- */

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /* ---------------- SOS TEST FUNCTION ---------------- */

  const triggerSOS = () => {
    const newAlert = {
      id: Date.now(),
      message: "🚨 SOS Triggered! User needs help immediately.",
      time: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => [newAlert, ...prev]);
    setShowNotifications(true);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="home-container">
      <Navbar />

      {/* 🔔 Notification Bell */}
      <div
        className="notification-bell"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </div>

      {/* ✅ Notification Sidebar */}
      <div
        className={`notification-sidebar ${showNotifications ? "open" : ""}`}
      >
        <div className="notification-header">
          <h3>Notifications</h3>
          <button onClick={() => setShowNotifications(false)}>✖</button>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="empty">No alerts</p>
          ) : (
            notifications.map((note) => (
              <div key={note.id} className="notification-card">
                <p>{note.message}</p>
                <span>{note.time}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-text">
          <h1>Empowering Independent Navigation</h1>
          <p>
            A next-generation assistive solution designed to enhance safety,
            confidence, and mobility using intelligent sensing and IoT.
          </p>

          <button className="primary-btn">View Dashboard</button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="section">
        <h2 className="section-title">Core Features</h2>

        <div className="cards-container">
          <div className="card glass hover">
            <h3>🚶 Obstacle Detection</h3>
            <p>
              Detects nearby obstacles in real-time and alerts the user through
              vibration feedback for safe navigation.
            </p>
          </div>

          <div className="card glass hover">
            <h3>💧 Water Detection</h3>
            <p>
              Identifies wet or slippery surfaces and prevents potential
              accidents during movement.
            </p>
          </div>

          <div className="card glass hover">
            <h3>🚨 SOS Emergency</h3>
            <p>
              Enables quick emergency alerts to caregivers ensuring immediate
              response during the critical situation.
            </p>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="section">
        <h2 className="section-title">About the Device</h2>

        <div className="info-grid">
          <div className="card glass hover">
            <h4>⚙ Smart Working</h4>
            <p>
              The Smart Cane continuously scans surroundings using sensors and
              instantly notifies users through vibration and sound alerts.
            </p>
          </div>

          <div className="card glass hover">
            <h4>🧩 Components</h4>
            <p>
              Built using ultrasonic sensors, water detection module,
              microcontroller and alert systems.
            </p>
          </div>

          <div className="card glass hover">
            <h4>🌐 Technology</h4>
            <p>
              Powered by IoT architecture, cloud connectivity and a React-based
              dashboard.
            </p>
          </div>

          <div className="card glass hover">
            <h4>📌 Purpose</h4>
            <p>
              Designed to promote independence and ensure safer mobility for
              visually impaired individuals.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <p>© 2026 Smart Cane Project | Built with IoT & React</p>
      </div>
    </div>
  );
};

export default Home;
