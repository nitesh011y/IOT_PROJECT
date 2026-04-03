const mqtt = require("mqtt");
const IoTEvent = require("../../models/IoTEvent");
const Stats = require("../../models/Stats.model");

const { send_mail } = require("../../mail_services/mail");

const { updateState, getState } = require("../../controler/monitor_dashboard");
const { getIO } = require("../../socket");

const BROKER_URL = "mqtt://test.mosquitto.org:1883";
const TOPICS = ["smartcane/#"];

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
  console.log(" MQTT Connected to mosquitto");

  client.subscribe(TOPICS, (err) => {
    if (err) console.error(" Subscription error:", err);
    else console.log(" Subscribed to topics:", TOPICS);
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

    //  Update in-memory state (REAL-TIME)
    updateState(payload);

    let data = getState();

    // if (data.sos) {
    //   send_mail();
    // }
    // Emit to dashboard instantly
    getIO().emit("dashboard:update", {
      event,
      state: getState(),
    });

    // save for anylasis

    await Stats.create({
      obstacle: data.obstacle,
      water: data.water,
      sos: data.sos,
      userStatus: data.userStatus,
      deviceStatus: data.deviceStatus,
    });

    //  Store event for history (NOT real-time)
    await IoTEvent.create({
      deviceId: "smartcane-001",
      payload: {
        topic,
        data: payload,
        receivedAt: event.receivedAt,
      },
      source: "smartcane",
    });

    console.log(" Real-time event sent:", payload);
  } catch (err) {
    console.error(" Message handling error:", err);
  }
});

client.on("error", (err) => {
  console.error(" MQTT Error:", err);
});

module.exports = client;
