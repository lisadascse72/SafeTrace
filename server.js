// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Railway uses dynamic port

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ serve frontend

const DATA_FILE = "sos_data.json";

// ✅ Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

// 🔴 POST: Emergency SOS
app.post("/sos", (req, res) => {
  const { name, phone, latitude, longitude, time } = req.body;
  if (!name || !latitude || !longitude || !time) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const sosData = JSON.parse(fs.readFileSync(DATA_FILE));
    sosData.unshift({
      name,
      phone: phone || null,
      latitude,
      longitude,
      time,
      type: "sos"
    });
    fs.writeFileSync(DATA_FILE, JSON.stringify(sosData, null, 2));
    res.json({ message: "✅ SOS received." });
  } catch (err) {
    console.error("❌ Failed to save SOS:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🟣 POST: Women Safety
app.post("/track", (req, res) => {
  const { name, phone, latitude, longitude, time, sessionId } = req.body;
  if (!name || !latitude || !longitude || !time || !sessionId) {
    return res.status(400).json({ message: "Missing tracking fields." });
  }

  try {
    const sosData = JSON.parse(fs.readFileSync(DATA_FILE));
    sosData.unshift({
      name,
      phone: phone || null,
      latitude,
      longitude,
      time,
      sessionId,
      type: "women-safety"
    });
    fs.writeFileSync(DATA_FILE, JSON.stringify(sosData, null, 2));
    res.json({ message: "📍 Women Safety alert received." });
  } catch (err) {
    console.error("❌ Failed to save tracking:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ GET: All Alerts
app.get("/alerts", (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    data = data.filter(item => item && typeof item === 'object');
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to read SOS data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ DELETE: Resolve by index
app.delete("/sos/:index", (req, res) => {
  const index = parseInt(req.params.index);
  try {
    const sosData = JSON.parse(fs.readFileSync(DATA_FILE));
    if (isNaN(index) || index < 0 || index >= sosData.length) {
      return res.status(404).json({ message: "Invalid SOS index." });
    }
    sosData.splice(index, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(sosData, null, 2));
    res.json({ message: "✔️ SOS marked as resolved and removed." });
  } catch (err) {
    console.error("❌ Error deleting SOS:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚨 Server running at http://localhost:${PORT}`);
});
