const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  waterIntake: Number,
  sleepHours: Number,
  exercise: String,
  mood: String,
});

module.exports = mongoose.model('HealthLog', healthLogSchema);
