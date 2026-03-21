const axios = require("axios");

const API_URL = "http://localhost:5001/api/tracking/location";
const TOKEN = process.argv[2];

if (!TOKEN) {
  console.log("Usage: node scripts/simulateVan.js <DRIVER_TOKEN>");
  process.exit(1);
}

const route = [
  { lat: 6.9271, lng: 79.8612 },
  { lat: 6.9275, lng: 79.8618 },
  { lat: 6.9280, lng: 79.8625 },
  { lat: 6.9285, lng: 79.8630 },
  { lat: 6.9290, lng: 79.8640 },
  { lat: 6.9295, lng: 79.8650 }
];

let index = 0;

async function sendLocation() {
  const point = route[index];

  try {
    const response = await axios.post(
      API_URL,
      {
        journeyId: 1,
        lat: point.lat,
        lng: point.lng
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Location sent:", point);
    console.log(response.data);

  } catch (error) {
    console.error("Error sending location:", error.message);
  }

  index++;

  if (index >= route.length) {
    console.log("Simulation finished");
    process.exit();
  }
}

setInterval(sendLocation, 3000);