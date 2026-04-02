const statusCard = document.getElementById("statusCard");
const statusText = document.getElementById("statusText");

const obstacleEl = document.getElementById("obstacle");
const waterEl = document.getElementById("water");
const sosEl = document.getElementById("sos");
const logList = document.getElementById("logList");

/* -------------------------
   INITIAL STATE
-------------------------- */
statusText.innerText = "WAITING";
statusCard.className = "card safe";

obstacleEl.innerText = "--";
waterEl.innerText = "--";
sosEl.innerText = "--";

/* -------------------------
   UPDATE UI
-------------------------- */
function updateDashboard(payload) {
  if (!payload) return;

  const time = new Date().toLocaleTimeString();

  // LOG
  const li = document.createElement("li");
  li.innerText = `[${time}] ${payload}`;
  logList.prepend(li);

  // SENSOR LOGIC
  if (payload.startsWith("Obstacle")) {
    obstacleEl.innerText = payload.replace("Obstacle ", "");
  }

  if (payload === "Water detected") {
    waterEl.innerText = "DETECTED";
  }

  if (payload === "SOS pressed") {
    sosEl.innerText = "PRESSED";
  }

  // STATUS LOGIC
  if (payload.includes("VERY CLOSE") || payload.includes("SOS")) {
    statusText.innerText = "DANGER";
    statusCard.className = "card danger";
  } else if (payload.includes("MEDIUM") || payload.includes("Water")) {
    statusText.innerText = "WARNING";
    statusCard.className = "card warning";
  } else if (payload.includes("FAR")) {
    statusText.innerText = "SAFE";
    statusCard.className = "card safe";
  }
}

/* -------------------------
   SOCKET.IO (REAL-TIME)
-------------------------- */
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to backend");
});

socket.on("dashboard:update", (data) => {
  updateDashboard(data.event.payload);
});

socket.on("disconnect", () => {
  console.log("Disconnected from backend");
  statusText.innerText = "OFFLINE";
  statusCard.className = "card warning";
});
