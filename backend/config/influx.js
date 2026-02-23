const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const writeApi = influxDB.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_BUCKET,
  "ns",
);

module.exports = { writeApi, Point };
