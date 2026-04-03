import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import "../styles/analytics.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [sosStats, setSosStats] = useState([]);
  const [waterStats, setWaterStats] = useState([]);
  const [obstacleStats, setObstacleStats] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, sosRes, waterRes, obstacleRes] = await Promise.all([
        axios.get("http://localhost:5000/api/stats/summary"),
        axios.get("http://localhost:5000/api/stats/sos-stats"),
        axios.get("http://localhost:5000/api/stats/water-stats"),
        axios.get("http://localhost:5000/api/stats/obstacle-stats"),
      ]);

      setSummary(summaryRes.data);
      setSosStats(sosRes.data);
      setWaterStats(waterRes.data);
      setObstacleStats(obstacleRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CHART DATA ================= */

  // SOS Pie Chart
  const sosPie = {
    labels: sosStats.map((s) => (s._id ? "SOS Pressed" : "No SOS")),
    datasets: [
      {
        data: sosStats.map((s) => s.count),
        backgroundColor: ["#ff4d4d", "#00ff9f"],
      },
    ],
  };

  // Water Pie Chart
  const waterPie = {
    labels: waterStats.map((w) => w._id),
    datasets: [
      {
        data: waterStats.map((w) => w.count),
        backgroundColor: ["#00bfff", "#cfcfcf"],
      },
    ],
  };

  // Obstacle Bar Chart
  const obstacleBar = {
    labels: obstacleStats.map((o) => o._id),
    datasets: [
      {
        label: "Obstacle Frequency",
        data: obstacleStats.map((o) => o.count),
        backgroundColor: "#5b8cff",
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="analytics-wrapper">
        <h1 className="analytics-title">Smart Cane Descriptive Analytics</h1>

        {/* ===== SUMMARY ===== */}
        {summary && (
          <div className="summary-cards">
            <div className="card">
              Total Records <br /> <b>{summary.totalRecords}</b>
            </div>
            <div className="card danger">
              SOS Alerts <br />{" "}
              <b>{sosStats.find((s) => s._id === true)?.count || 0}</b>
            </div>
            <div className="card">
              Water Detected <br />{" "}
              <b>{waterStats.find((w) => w._id === "DETECTED")?.count || 0}</b>
            </div>
            <div className="card">
              Most Common Obstacle <br /> <b>{summary.obstacleMode}</b>
            </div>
          </div>
        )}

        {/* ===== CHARTS ===== */}
        <div className="charts-container">
          <div className="chart-card">
            <h3>SOS Distribution</h3>
            <Pie data={sosPie} />
          </div>

          <div className="chart-card">
            <h3>Water Detection Distribution</h3>
            <Pie data={waterPie} />
          </div>

          <div className="chart-card">
            <h3>Obstacle Frequency</h3>
            <Bar data={obstacleBar} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
