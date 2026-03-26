const mqtt = require("mqtt");

const BROKER_URL = "mqtt://test.mosquitto.org:1883";
const IoTEvent = require("../../models/IoTEvent");

// Use SAME topics as ESP8266
const TOPICS = [
  // "smartcane/distance",
  // "smartcane/water",
  // "smartcane/sos",
  "smartcane/#",
];

// Store latest state (important)
// const deviceState = {
//   distance: null,
//   water: null,
//   sos: null,
//   lastUpdated: null,
// };

let deviceState = {
  topic: null,
  payload: null,
  receivedAt: null,
};

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
  console.log(" MQTT Connected to mosquitto");

  client.subscribe(TOPICS, (err) => {
    if (err) {
      console.error(" Subscription error:", err);
    } else {
      console.log(" Subscribed to topics:", TOPICS);
    }
  });
});

// client.on("message", (topic, message) => {
//   const value = message.toString();

//   console.log(topic);
//   switch (topic) {
//     case "smartcane/distance":
//       deviceState.distance = Number(value);
//       break;

//     case "smartcane/water":
//       deviceState.water = Number(value);
//       break;

//     case "smartcane/sos":
//       deviceState.sos = value === "1";
//       break;
//   }

//   deviceState.lastUpdated = new Date();

//   console.log("DATA RECEIVED");
//   console.log(deviceState);

//   //  Here you can:
//   // - Save to MongoDB
//   // - Save to InfluxDB
//   // - Trigger alerts
// });

client.on("message", async (topic, message) => {
  const payload = message.toString();
  deviceState = {
    topic,
    payload,
    receivedAt: new Date(),
  };

  if (deviceState.payload) {
    await IoTEvent.create({
      payload: deviceState,
      source: "smartcane",
    });
  }

  console.log(deviceState);
});

client.on("error", (err) => {
  console.error(" MQTT Error:", err);
});

module.exports = deviceState;
