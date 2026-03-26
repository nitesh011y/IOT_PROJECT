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
