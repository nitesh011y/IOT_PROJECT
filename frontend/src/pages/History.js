import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./../styles/history.css";

const url = import.meta.process.env.VITE_API_BASE_URL;

function History() {
  const [logs, setLogs] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [limit, setLimit] = useState(50); // default limit
  const [loading, setLoading] = useState(false);

  // Fetch logs from backend with filters and limit
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/history_data`, {
        params: { from: fromDate, to: toDate, limit },
      });

      const formattedLogs = res.data.map((log) => ({
        time: new Date(log.timestamp).toLocaleTimeString(),
        activity: log.activity || log.payload?.payload || "Unknown Event",
        type: log.type || log.payload?.type || "safe",
      }));

      setLogs(formattedLogs.reverse());
    } catch (err) {
      console.error("Error fetching history logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Export CSV
  const exportCSV = async () => {
    try {
      const res = await axios.get(`${url}/api/history_data/export`, {
        params: { from: fromDate, to: toDate, limit },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "history_logs.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error exporting CSV:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getBadgeClass = (activity) => {
    const a = activity.toLowerCase();
    if (a.includes("safe")) return "safe";
    if (a.includes("sos") || a.includes("alert")) return "alert";
    if (a.includes("water") || a.includes("obstacle")) return "warning";
    return "safe";
  };

  return (
    <div className="history-wrapper">
      <Navbar />
      <h1 className="history-title">Activity History Logs</h1>

      {/* Filters */}
      <div className="filters-container">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          min="1"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="filter-input"
          placeholder="Limit"
        />
        <button className="filter-btn" onClick={fetchLogs}>
          Filter
        </button>
        <button className="export-btn" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2">Loading...</td>
              </tr>
            ) : logs.length ? (
              logs.map((log, index) => (
                <tr key={index}>
                  <td className="log-time">{log.time}</td>
                  <td>
                    <span
                      className={`log-activity ${getBadgeClass(log.activity)}`}
                    >
                      {log.activity}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
