const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("School Transport Management Backend Running");
});

// Driver test route
app.post("/api/drivers", (req, res) => {
  const { name, phone, license_number } = req.body;

  const driver = {
    name,
    phone,
    license_number
  };

  console.log("Driver received:", driver);

  res.json({
    message: "Driver created successfully",
    driver: driver
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});