import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import "../styles/analytics.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
);

function Analytics() {
  const [overview, setOverview] = useState(null);
  const [obstacleBreakdown, setObstacleBreakdown] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [statusTimeline, setStatusTimeline] = useState([]);
  const [descriptiveStats, setDescriptiveStats] = useState(null);

  useEffect(() => {
    // Fetch all analytics data
    axios
      .get("http://localhost:5000/api/analytics/overview")
      .then((res) => setOverview(res.data));
    axios
      .get("http://localhost:5000/api/analytics/obstacle-breakdown")
      .then((res) => setObstacleBreakdown(res.data));
    axios
      .get("http://localhost:5000/api/analytics/timeline?interval=hour")
      .then((res) => {
        setTimeline(res.data);
        if (overview && res.data.length > 0) {
          computeDescriptiveStats(overview, obstacleBreakdown, res.data);
        }
      });
    axios
      .get("http://localhost:5000/api/analytics/status-timeline")
      .then((res) => setStatusTimeline(res.data));
  }, []);

  useEffect(() => {
    if (overview && obstacleBreakdown.length > 0 && timeline.length > 0) {
      computeDescriptiveStats(overview, obstacleBreakdown, timeline);
    }
  }, [overview, obstacleBreakdown, timeline]);

  const computeDescriptiveStats = (
    overviewData,
    obstacleData,
    timelineData,
  ) => {
    const totalEvents = overviewData.totalEvents;
    const totalObstacles = overviewData.totalObstacles;
    const totalWater = overviewData.totalWater;
    const totalSOS = overviewData.totalSOS;

    const obstacleMap = {};
    obstacleData.forEach((item) => {
      obstacleMap[item._id] = item.count;
    });
    const farCount = obstacleMap.FAR || 0;
    const mediumCount = obstacleMap.MEDIUM || 0;
    const veryCloseCount = obstacleMap["VERY CLOSE"] || 0;
    const totalObsCount = farCount + mediumCount + veryCloseCount;

    const farPercent = totalObsCount
      ? ((farCount / totalObsCount) * 100).toFixed(1)
      : 0;
    const mediumPercent = totalObsCount
      ? ((mediumCount / totalObsCount) * 100).toFixed(1)
      : 0;
    const veryClosePercent = totalObsCount
      ? ((veryCloseCount / totalObsCount) * 100).toFixed(1)
      : 0;

    let modeDistance = "N/A";
    let maxCount = 0;
    if (farCount > maxCount) {
      maxCount = farCount;
      modeDistance = "FAR";
    }
    if (mediumCount > maxCount) {
      maxCount = mediumCount;
      modeDistance = "MEDIUM";
    }
    if (veryCloseCount > maxCount) {
      maxCount = veryCloseCount;
      modeDistance = "VERY CLOSE";
    }

    let minDate = null,
      maxDate = null;
    if (timelineData.length > 0) {
      const dateStrs = timelineData.map((t) => t._id.split(" ")[0]);
      const uniqueDates = [...new Set(dateStrs)];
      if (uniqueDates.length > 0) {
        minDate = new Date(uniqueDates[0]);
        maxDate = new Date(uniqueDates[uniqueDates.length - 1]);
      }
    }
    const daysDiff =
      minDate && maxDate
        ? Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)))
        : 1;

    const sosPerDay = (totalSOS / daysDiff).toFixed(2);
    const waterPerDay = (totalWater / daysDiff).toFixed(2);
    const obstaclePerDay = (totalObstacles / daysDiff).toFixed(2);
    const totalHours = daysDiff * 24;
    const eventsPerHour = totalHours
      ? (totalEvents / totalHours).toFixed(2)
      : 0;

    let maxEventsHour = 0,
      mostActiveHour = "";
    if (timelineData.length > 0) {
      timelineData.forEach((t) => {
        if (t.totalEvents > maxEventsHour) {
          maxEventsHour = t.totalEvents;
          mostActiveHour = t._id;
        }
      });
    }

    setDescriptiveStats({
      totalEvents,
      totalObstacles,
      totalWater,
      totalSOS,
      farCount,
      mediumCount,
      veryCloseCount,
      farPercent,
      mediumPercent,
      veryClosePercent,
      modeDistance,
      daysRange: daysDiff,
      sosPerDay,
      waterPerDay,
      obstaclePerDay,
      eventsPerHour,
      mostActiveHour,
      maxEventsHour,
    });
  };

  /* ===== CHART DATA ===== */

  const obstacleChartData = {
    labels: obstacleBreakdown.map((item) => item._id),
    datasets: [
      {
        label: "Obstacle Count",
        data: obstacleBreakdown.map((item) => item.count),
        backgroundColor: "#ff9800",
      },
    ],
  };

  const userStatusCounts = () => {
    const counts = {};
    statusTimeline.forEach((entry) => {
      const status = entry.userStatus;
      if (status) counts[status] = (counts[status] || 0) + 1;
    });
    return Object.keys(counts).map((status) => ({
      _id: status,
      count: counts[status],
    }));
  };
  const userStatusData = userStatusCounts();
  const userStatusChartData = {
    labels: userStatusData.map((u) => u._id),
    datasets: [
      {
        data: userStatusData.map((u) => u.count),
        backgroundColor: ["#00ff9f", "#ff9800", "#ff4d4d", "#4d4dff"],
      },
    ],
  };

  const timelineChartData = {
    labels: timeline.map((t) => t._id),
    datasets: [
      {
        label: "Total Events",
        data: timeline.map((t) => t.totalEvents),
        borderColor: "#00eaff",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Obstacles",
        data: timeline.map((t) => t.obstacles),
        borderColor: "#ff9800",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Water Detected",
        data: timeline.map((t) => t.water),
        borderColor: "#00ccff",
        tension: 0.4,
        fill: false,
      },
      {
        label: "SOS",
        data: timeline.map((t) => t.sos),
        borderColor: "#ff4d4d",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="analytics-wrapper">
        <h1 className="analytics-title">Smart Cane Analytics</h1>

        {/* ===== SUMMARY CARDS ===== */}
        {overview && (
          <div className="summary-cards">
            <div className="card">Total Events: {overview.totalEvents}</div>
            <div className="card">
              Total Obstacles: {overview.totalObstacles}
            </div>
            <div className="card warning">
              Water Detected: {overview.totalWater}
            </div>
            <div className="card danger">SOS Alerts: {overview.totalSOS}</div>
            <div className="card">
              Latest User Status: {overview.currentUserStatus || "N/A"}
            </div>
            <div className="card">
              Latest Device Status: {overview.currentDeviceStatus || "N/A"}
            </div>
          </div>
        )}

        {/* ===== DESCRIPTIVE STATISTICS ===== */}
        {descriptiveStats && (
          <div className="descriptive-stats">
            <h2>📊 Descriptive Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">📈</span>
                <div className="stat-info">
                  <h4>Event Summary</h4>
                  <p>
                    <strong>Total Events:</strong>{" "}
                    {descriptiveStats.totalEvents}
                  </p>
                  <p>
                    <strong>Events per hour (avg):</strong>{" "}
                    {descriptiveStats.eventsPerHour}
                  </p>
                  <p>
                    <strong>Data range:</strong> {descriptiveStats.daysRange}{" "}
                    days
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🚧</span>
                <div className="stat-info">
                  <h4>Obstacle Distances</h4>
                  <p>
                    <strong>FAR:</strong> {descriptiveStats.farCount} (
                    {descriptiveStats.farPercent}%)
                  </p>
                  <p>
                    <strong>MEDIUM:</strong> {descriptiveStats.mediumCount} (
                    {descriptiveStats.mediumPercent}%)
                  </p>
                  <p>
                    <strong>VERY CLOSE:</strong>{" "}
                    {descriptiveStats.veryCloseCount} (
                    {descriptiveStats.veryClosePercent}%)
                  </p>
                  <p>
                    <strong>Most common:</strong>{" "}
                    {descriptiveStats.modeDistance}
                  </p>
                  <p>
                    <strong>Obstacles per day (avg):</strong>{" "}
                    {descriptiveStats.obstaclePerDay}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💧</span>
                <div className="stat-info">
                  <h4>Water Detection</h4>
                  <p>
                    <strong>Total:</strong> {descriptiveStats.totalWater}
                  </p>
                  <p>
                    <strong>Per day (avg):</strong>{" "}
                    {descriptiveStats.waterPerDay}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🚨</span>
                <div className="stat-info">
                  <h4>SOS Alerts</h4>
                  <p>
                    <strong>Total SOS:</strong> {descriptiveStats.totalSOS}
                  </p>
                  <p>
                    <strong>SOS per day (avg):</strong>{" "}
                    {descriptiveStats.sosPerDay}
                  </p>
                  <p>
                    <strong>Most active hour:</strong>{" "}
                    {descriptiveStats.mostActiveHour} (
                    {descriptiveStats.maxEventsHour} events)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== CHARTS ===== */}
        <div className="charts-container">
          <div className="chart-card">
            <h3>Obstacle Levels (Distance Breakdown)</h3>
            <Bar data={obstacleChartData} />
          </div>

          <div className="chart-card">
            <h3>User Status Distribution</h3>
            {userStatusData.length > 0 ? (
              <Pie data={userStatusChartData} />
            ) : (
              <p>No user status data available</p>
            )}
          </div>

          <div className="chart-card">
            <h3>Event Timeline (last 7 days, hourly)</h3>
            <Line data={timelineChartData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
