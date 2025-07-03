const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const Alert = require("./models/Alert"); // MongoDB model

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas Connection
const uri = "mongodb+srv://iamlisadas2004:oDUbyeGUduPTQjzG@cluster0.713r2m0.mongodb.net/safetrace?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Admin
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
    console.error(err);
    res.status(500).json({ message: "❌ Failed to save SOS alert" });
  }
});

// POST /track (Women Safety)
app.post("/track", async (req, res) => {
  try {
    const data = {
      ...req.body,
      type: "women-safety"
    };
    await Alert.create(data);
    res.json({ message: "✅ Women safety alert saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Failed to save women safety alert" });
  }
});

// GET all alerts
app.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ _id: -1 }); // latest first
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch alerts" });
  }
});

// DELETE alert (Mark resolved)
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
    res.status(500).json({ message: "❌ Failed to delete alert" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
