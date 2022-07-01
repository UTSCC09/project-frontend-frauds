const mongoose = require("mongoose");
const { Schema } = mongoose;

const Airline = new Schema({
  airlineId: String,
  name: String,
  alias: String,
  iata: String,
  icao: String,
  callsign: String,
  country: String,
  active: String,
});

module.exports = mongoose.model("Airline", Airline);
