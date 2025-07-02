const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "sos_data.json";

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

// POST: Receive SOS
app.post("/sos", (req, res) => {
  const { name, phone, latitude, longitude, time } = req.body;

  if (!name || !latitude || !longitude || !time) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const sosData = JSON.parse(fs.readFileSync(DATA_FILE));
    sosData.unshift({ name, phone: phone || null, latitude, longitude, time });
    fs.writeFileSync(DATA_FILE, JSON.stringify(sosData, null, 2));
    res.json({ message: "✅ SOS received." });
  } catch (err) {
    console.error("❌ Failed to save SOS:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: Return all alerts
app.get("/alerts", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to read SOS data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE: Resolve (remove) SOS by index
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

app.listen(PORT, () => {
  console.log(`🚨 SOS Server running at http://localhost:${PORT}`);
});
