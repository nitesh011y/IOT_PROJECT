const mqtt = require("mqtt");
const IoTEvent = require("../../models/IoTEvent");
const { updateState, getState } = require("../../controler/monitor_dashboard");
const { getIO } = require("../../socket");

const BROKER_URL = "mqtt://test.mosquitto.org:1883";

// Subscribe to all smartcane topics
const TOPICS = ["smartcane/#"];

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
  console.log("MQTT Connected to mosquitto");

  client.subscribe(TOPICS, (err) => {
    if (err) console.error("Subscription error:", err);
    else console.log("Subscribed to topics:", TOPICS);
  });
});

client.on("message", async (topic, message) => {
  try {
    const payload = message.toString();

    const event = {
      topic,
      payload,
      receivedAt: new Date(),
    };

    // Update real-time state
    updateState(payload);

    // Send live update to dashboard
    getIO().emit("dashboard:update", {
      event,
      state: getState(),
    });

    // Save event history
    await IoTEvent.create({
      deviceId: "smartcane-001",
      payload: {
        topic,
        value: payload,
        receivedAt: event.receivedAt,
      },
      source: "smartcane",
    });

    console.log("Real-time event sent:", payload);
  } catch (err) {
    console.error("Message handling error:", err);
  }
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});

module.exports = client;