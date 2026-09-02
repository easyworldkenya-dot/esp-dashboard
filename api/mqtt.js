import mqtt from "mqtt";

export default async function handler(req, res) {
  // Allow the dashboard to call this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  // Read credentials from Vercel Environment Variables
  const host = process.env.MQTT_HOST;
  const port = process.env.MQTT_PORT || "8883";
  const username = process.env.MQTT_USERNAME;
  const password = process.env.MQTT_PASSWORD;

  // Make sure the credentials exist
  if (!host || !username || !password) {
    return res.status(500).json({
      error: "MQTT environment variables are missing"
    });
  }

  const brokerUrl = `mqtts://${host}:${port}`;

  const client = mqtt.connect(brokerUrl, {
    username: username,
    password: password,
    clientId: "Vercel_API_" + Math.random().toString(16).substring(2),
    connectTimeout: 10000
  });

  client.on("connect", () => {
    client.end();

    return res.status(200).json({
      success: true,
      message: "Connected to HiveMQ successfully"
    });
  });

  client.on("error", (error) => {
    client.end();

    return res.status(500).json({
      success: false,
      error: "Could not connect to HiveMQ"
    });
  });
}
