import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/home.css";
import "../styles/notification.css";
import Navbar from "./Navbar";

const SOCKET_URL = "http://localhost:5000";
const SOS_COOLDOWN_MS = 10000; // 10 seconds – adjust as needed

const Home = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const lastSOSTimeRef = useRef(0); // track last SOS notification time

  // Add SOS notification (with cooldown)
  const addSOSNotification = useCallback(() => {
    const now = Date.now();
    // If last SOS was within cooldown period, ignore this duplicate
    if (now - lastSOSTimeRef.current < SOS_COOLDOWN_MS) {
      console.log("SOS cooldown active, ignoring duplicate");
      return;
    }
    lastSOSTimeRef.current = now;

    const newAlert = {
      id: now,
      message: "🚨 SOS Triggered! User needs help immediately.",
      time: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newAlert, ...prev]);
    // Auto‑open sidebar when new SOS arrives
    setShowNotifications(true);
  }, []);

  // Socket connection – listen to dashboard:update
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to dashboard socket");
    });

    socket.on("dashboard:update", ({ state }) => {
      if (state && state.sos === true) {
        addSOSNotification();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [addSOSNotification]);

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* Bell icon – hidden when sidebar open */}
      {!showNotifications && (
        <div
          className="notification-bell"
          onClick={() => setShowNotifications(true)}
        >
          🔔
          {notifications.length > 0 && (
            <span className="badge">{notifications.length}</span>
          )}
        </div>
      )}

      {/* Notification Sidebar */}
      <div
        className={`notification-sidebar ${showNotifications ? "open" : ""}`}
      >
        <div className="notification-header">
          <h3>SOS Alerts</h3>
          <div className="header-actions">
            {notifications.length > 0 && (
              <button className="clear-all" onClick={clearAll}>
                Clear all
              </button>
            )}
            <button
              className="close-btn"
              onClick={() => setShowNotifications(false)}
            >
              ✖
            </button>
          </div>
        </div>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="empty">No SOS alerts</p>
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

      {/* Hero, Features, About, Footer – unchanged */}
      <div className="hero">
        <div className="hero-text">
          <h1>Empowering Independent Navigation</h1>
          <p>
            A next‑generation assistive solution designed to enhance safety,
            confidence, and mobility using intelligent sensing and IoT.
          </p>
          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/analytics")}
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Core Features</h2>
        <div className="cards-container">
          <div className="card glass hover">
            <h3>🚶 Obstacle Detection</h3>
            <p>
              Detects nearby obstacles in real‑time and alerts the user through
              vibration feedback.
            </p>
          </div>
          <div className="card glass hover">
            <h3>💧 Water Detection</h3>
            <p>
              Identifies wet or slippery surfaces and prevents potential
              accidents.
            </p>
          </div>
          <div className="card glass hover">
            <h3>🚨 SOS Emergency</h3>
            <p>
              Enables quick emergency alerts to caregivers ensuring immediate
              response.
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">About the Device</h2>
        <div className="info-grid">
          <div className="card glass hover">
            <h4>⚙ Smart Working</h4>
            <p>
              The Smart Cane continuously scans surroundings using sensors and
              instantly notifies users.
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
              Powered by IoT architecture, cloud connectivity and a React‑based
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

      <div className="footer">
        <p>© 2026 Smart Cane Project | Built with IoT & React</p>
      </div>
    </div>
  );
};

export default Home;
