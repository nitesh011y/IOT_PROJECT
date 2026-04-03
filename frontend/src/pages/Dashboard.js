import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import "../styles/dashboard.css";
import Navbar from "./Navbar";

const SOCKET_URL = "http://localhost:5000";

function Dashboard() {
  const [userStatus, setUserStatus] = useState("WAITING");
  const [obstacle, setObstacle] = useState("--");
  const [water, setWater] = useState("SAFE");
  const [deviceStatus, setDeviceStatus] = useState("OFFLINE");
  const [logs, setLogs] = useState([]);
  const [showSOS, setShowSOS] = useState(false);

  // Ref to track socket instance for cleanup
  const socketRef = useRef(null);

  // Map backend values to display & CSS classes
  const normalizeStatus = (status) => {
    if (!status) return "waiting";
    const s = status.toString().toLowerCase();
    if (["safe", "waiting"].includes(s)) return "safe";
    if (["warning"].includes(s)) return "warning";
    if (["danger", "alert"].includes(s)) return "danger";
    return "safe";
  };

  // Add log function - professional format without emojis
  const addLog = useCallback((message) => {
    const time = new Date().toLocaleTimeString();
    const logMessage = `✓ ${time} - ${message}`;
    setLogs((prev) => {
      if (prev[0] === logMessage) return prev;
      return [logMessage, ...prev.slice(0, 20)];
    });
  }, []);

  // Socket.IO connection - runs only once on mount
  useEffect(() => {
    // Create socket connection
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      setDeviceStatus("ONLINE");
      addLog("Device Connected");
    });

    socket.on("disconnect", () => {
      setDeviceStatus("OFFLINE");
      addLog("Device Disconnected");
    });

    socket.on("dashboard:update", ({ event, state }) => {
      if (!state) return;

      const user = normalizeStatus(state.userStatus);
      const obs = state.obstacle ?? "--";
      const device = state.deviceStatus?.toUpperCase() || "OFFLINE";
      const waterState = state.water || "SAFE";

      setUserStatus(user);
      setObstacle(obs);
      setDeviceStatus(device);
      setWater(waterState);

      addLog(`User Status: ${user.toUpperCase()}`);
      addLog(`Water Level: ${waterState}`);
      addLog(`Obstacle: ${obs}`);
      addLog(`Device: ${device}`);

      if (state.sos === true && !showSOS) {
        setShowSOS(true);
        addLog("SOS Button Pressed");
        setTimeout(() => setShowSOS(false), 5000);
      }

      if (event && event.payload) {
        const payloadStr =
          typeof event.payload === "string"
            ? event.payload
            : JSON.stringify(event.payload);
        addLog(payloadStr);
      }
    });

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [addLog]); // Only addLog as dependency (stable), showSOS removed

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Smart Cane Monitoring Dashboard</h1>

      {/* TOP CARDS */}
      <div className="card-grid">
        <div className="card">
          <h3>User Status</h3>
          <div className={`status ${userStatus}`}>
            {userStatus.toUpperCase()}
          </div>
        </div>

        <div className="card">
          <h3>Water Level</h3>
          <p className={`value ${water === "DETECTED" ? "danger" : "safe"}`}>
            {water.toUpperCase()}
          </p>
        </div>

        <div className="card">
          <h3>Distance to Obstacle</h3>
          <p className="value">{obstacle}</p>
        </div>

        <div className="card">
          <h3>Device Status</h3>
          <p className={`device ${deviceStatus.toLowerCase()}`}>
            {deviceStatus === "ONLINE" ? "● ONLINE" : "● OFFLINE"}
          </p>
        </div>
      </div>

      {/* BOTTOM CARDS */}
      <div className="bottom-grid">
        <div className="card log-card">
          <h3>Live Log Feed</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>

        {/* <div className="card connection-card">
          <h3>Connection Status</h3>
          <p>
            {deviceStatus === "ONLINE" ? "Device Online" : "Device Offline"}
          </p>
        </div> */}
      </div>

      {/* SOS Notification (slide from right) */}
      {/* {showSOS && (
        <div className="sos-slide">
          <div className="sos-content">
            <div className="warning-icon">!</div>
            <div>
              <h4>EMERGENCY SOS ALERT</h4>
              <p>SOS Button Pressed</p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Dashboard;
