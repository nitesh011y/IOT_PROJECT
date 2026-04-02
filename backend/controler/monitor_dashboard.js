let dashboardState = {
  obstacle: "FAR",
  water: "NOT_DETECTED",
  sos: false,
  userStatus: "SAFE",
  deviceStatus: "ONLINE",
  lastSeen: null,
};

function updateState(payload) {
  dashboardState.lastSeen = new Date();
  dashboardState.deviceStatus = "ONLINE";

  if (payload.includes("Obstacle FAR")) {
    dashboardState.obstacle = "FAR";
    dashboardState.userStatus = "SAFE";
  }

  if (payload.includes("Obstacle MEDIUM")) {
    dashboardState.obstacle = "MEDIUM";
    dashboardState.userStatus = "WARNING";
  }

  if (payload.includes("Obstacle VERY CLOSE")) {
    dashboardState.obstacle = "VERY CLOSE";
    dashboardState.userStatus = "DANGER";
  }

  if (payload === "Water detected") {
    dashboardState.water = "DETECTED";
    dashboardState.userStatus = "DANGER";
  }

  if (payload === "SOS pressed") {
    dashboardState.sos = true;
    dashboardState.userStatus = "EMERGENCY";
  }
}

function getState() {
  return dashboardState;
}

module.exports = { updateState, getState };
