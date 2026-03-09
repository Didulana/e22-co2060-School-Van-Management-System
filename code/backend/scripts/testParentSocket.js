const { io } = require("socket.io-client");

const TOKEN = process.argv[2];

if (!TOKEN) {
  console.error("Usage: node scripts/testParentSocket.js <PARENT_JWT>");
  process.exit(1);
}

const socket = io("http://localhost:5001", {
  auth: {
    token: TOKEN,
  },
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("tracking:subscribe-journey", {
    journeyId: 1,
  });
});

socket.on("tracking:subscribed", (data) => {
  console.log("Subscribed:", data);
});

socket.on("tracking:location-broadcast", (data) => {
  console.log("Live location received:", data);
});

socket.on("notification:new", (data) => {
  console.log("Notification received:", data);
});

socket.on("auth:error", (data) => {
  console.log("Auth error:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});