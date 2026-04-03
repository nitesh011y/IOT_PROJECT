import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import "../styles/dashboard.css";
import Navbar from "./Navbar";

const url = import.meta.process.env.VITE_API_BASE_URL;
const SOCKET_URL = url;

function Dashboard() {
  const [userStatus, setUserStatus] = useState("WAITING");
  const [obstacle, setObstacle] = useState("--");
  const [water, setWater] = useState("SAFE");
  const [deviceStatus, setDeviceStatus] = useState("OFFLINE");
  const [logs, setLogs] = useState([]);
  const [showSOS, setShowSOS] = useState(false);

  const socketRef = useRef(null);
  const prevSosRef = useRef(false); // track previous SOS state

  const normalizeStatus = (status) => {
    if (!status) return "waiting";
    const s = status.toString().toLowerCase();
    if (["safe", "waiting"].includes(s)) return "safe";
    if (["warning"].includes(s)) return "warning";
    if (["danger", "alert"].includes(s)) return "danger";
    return "safe";
  };

  const addLog = useCallback((message) => {
    const time = new Date().toLocaleTimeString();
    const logMessage = `✓ ${time} - ${message}`;
    setLogs((prev) => {
      if (prev[0] === logMessage) return prev;
      return [logMessage, ...prev.slice(0, 20)];
    });
  }, []);

  useEffect(() => {
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

      // ✅ SOS EDGE DETECTION: trigger only when sos changes from false → true
      const currentSos = state.sos === true;
      if (currentSos && !prevSosRef.current) {
        setShowSOS(true);
        addLog("SOS Button Pressed");
        setTimeout(() => setShowSOS(false), 5000);
      }
      prevSosRef.current = currentSos;

      if (event && event.payload) {
        const payloadStr =
          typeof event.payload === "string"
            ? event.payload
            : JSON.stringify(event.payload);
        addLog(payloadStr);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [addLog]);

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <h1 className="dashboard-title">Smart Cane Monitoring Dashboard</h1>

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

      <div className="bottom-grid">
        <div className="card log-card">
          <h3>Live Log Feed</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
