import Navbar from "../pages/Navbar";
import "../styles/analytics.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

function Analytics() {

  /* ================= STATIC DATA ================= */

  // Distance readings during walk
  const lineData = {
    labels: ["12:30", "12:32", "12:34", "12:36", "12:38", "12:40"],
    datasets: [
      {
        label: "Distance to Obstacle (cm)",
        data: [65, 50, 42, 30, 55, 70],
        borderColor: "#00eaff",
        backgroundColor: "#00eaff33",
        tension: 0.4,
      },
    ],
  };

  // Event distribution
  const pieData = {
    labels: [
      "Safe Movement",
      "Obstacle Detected",
      "Water Detection",
      "SOS Alerts",
    ],
    datasets: [
      {
        data: [60, 25, 10, 5],
        backgroundColor: [
          "#00ff9f",
          "#ffcc00",
          "#00eaff",
          "#ff4d6d",
        ],
      },
    ],
  };

  /* ================= STATIC ANALYSIS ================= */

  const analysisPoints = [
    "User remained safe for 60% of total monitoring duration.",
    "Obstacle detection occurred frequently between 12:32–12:36.",
    "Water detection events were minimal indicating stable terrain.",
    "One emergency alert detected requiring monitoring attention.",
  ];

  const conclusion =
    "Overall movement pattern indicates SAFE navigation conditions with occasional obstacles. Device performance and connectivity remained stable throughout monitoring.";

  return (
    <>
      <Navbar />

      <div className="analytics-wrapper">

        <h1 className="analytics-title">
          Smart Cane Data Analytics
        </h1>

        {/* ===== CHART SECTION ===== */}
        <div className="charts-container">

          <div className="chart-card">
            <h3>Obstacle Distance Trend</h3>
            <Line data={lineData} />
          </div>

          <div className="chart-card">
            <h3>Activity Distribution</h3>
            <Pie data={pieData} />
          </div>

        </div>

        {/* ===== ANALYSIS TEXT ===== */}
        <div className="analysis-card">
          <h3>System Analysis</h3>

          <ul>
            {analysisPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* ===== CONCLUSION ===== */}
        <div className="conclusion-card">
          <h3>Conclusion</h3>
          <p>{conclusion}</p>
        </div>

      </div>
    </>
  );
}

export default Analytics;