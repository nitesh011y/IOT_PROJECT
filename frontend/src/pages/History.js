import "./../styles/history.css";
import Navbar from "./Navbar";

function History() {

  // 🔹 Sample Logs (later connect backend)
  const logs = [
    { time: "12:35:08", activity: "User is SAFE" },
    { time: "12:34:55", activity: "Water Level High : 620" },
    { time: "12:34:45", activity: "Distance to Obstacle : 42 cm" },
    { time: "12:34:10", activity: "Device Connected" },
    { time: "12:33:30", activity: "User is SAFE" },
    { time: "12:32:02", activity: "SOS Button Pressed" }
  ];

  return (
    <div className="history-wrapper">
        <Navbar/>
      <h1 className="history-title">
        Activity History Logs
      </h1>

      <div className="history-table-container">

        <table className="history-table">

          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.time}</td>
                <td>{log.activity}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div> 
  );
}

export default History;