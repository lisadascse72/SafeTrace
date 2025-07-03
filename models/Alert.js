const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  name: String,
  phone: String,
  latitude: Number,
  longitude: Number,
  time: String,
  sessionId: String,
  type: String
});

module.exports = mongoose.model('Alert', alertSchema);
