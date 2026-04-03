import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/home.css";
import "../styles/notification.css";
import Navbar from "./Navbar";

const SOCKET_URL = "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Add SOS notification (no popup)
  const addSOSNotification = useCallback(() => {
    const newAlert = {
      id: Date.now(),
      message: "🚨 SOS Triggered! User needs help immediately.",
      time: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newAlert, ...prev]);
    // Auto‑open sidebar when new SOS arrives (optional)
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

  // Clear single notification
  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* 🔔 Bell icon – hidden when sidebar open */}
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

      {/* Notification Sidebar – only SOS messages */}
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
                <button
                  className="clear-one"
                  onClick={() => clearNotification(note.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hero Section */}
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

      {/* Core Features */}
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

      {/* About Section */}
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

      {/* Footer */}
      <div className="footer">
        <p>© 2026 Smart Cane Project | Built with IoT & React</p>
      </div>
    </div>
  );
};

export default Home;
