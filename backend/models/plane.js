const mongoose = require("mongoose");
const { Schema } = mongoose;

const Plane = new Schema({
  name: String,
  iata: String,
  icao: String,
  passengerCapacity: Number,
  seats: [[]],
});

module.exports = mongoose.model("Plane", Plane);
