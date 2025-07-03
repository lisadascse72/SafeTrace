const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Alert = require("./models/Alert");

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB Connection
const uri = process.env.MONGO_URI;
console.log("🌐 MONGO_URI:", uri); // Debug

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Fail fast if DB isn't connected
  });

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Static Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/admin-login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

// POST /sos
app.post("/sos", async (req, res) => {
  try {
    const data = {
      ...req.body,
      type: "sos",
      sessionId: `SOS-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    await Alert.create(data);
    res.json({ message: "✅ SOS alert saved" });
  } catch (err) {
    console.error("❌ Error saving SOS alert:", err);
    res.status(500).json({ message: "❌ Failed to save SOS alert" });
  }
});

// POST /track
app.post("/track", async (req, res) => {
  try {
    const data = {
      ...req.body,
      type: "women-safety"
    };
    await Alert.create(data);
    res.json({ message: "✅ Women safety alert saved" });
  } catch (err) {
    console.error("❌ Error saving women safety alert:", err);
    res.status(500).json({ message: "❌ Failed to save women safety alert" });
  }
});

// GET /alerts
app.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ _id: -1 }); // Latest first
    res.json(alerts);
  } catch (err) {
    console.error("❌ Error fetching alerts:", err);
    res.status(500).json({ message: "❌ Failed to fetch alerts" });
  }
});

// DELETE /sos/:index
app.delete("/sos/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const alerts = await Alert.find().sort({ _id: -1 });

    if (index < 0 || index >= alerts.length) {
      return res.status(404).json({ message: "❌ Invalid alert index" });
    }

    const alertToDelete = alerts[index];
    await Alert.findByIdAndDelete(alertToDelete._id);

    res.json({ message: "✔️ Alert marked as resolved" });
  } catch (err) {
    console.error("❌ Error deleting alert:", err);
    res.status(500).json({ message: "❌ Failed to delete alert" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
