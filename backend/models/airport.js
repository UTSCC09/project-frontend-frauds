const mongoose = require("mongoose");
const { Schema } = mongoose;

const Airport = new Schema({
  airportId: String,
  name: String,
  city: String,
  country: String,
  iata: String,
  icao: String,
  latitude: String,
  longitude: String,
  altitude: String,
  timezone: String,
  dst: String,
  tzDatabaseTimeZone: String,
  type: String,
  source: String,
});

module.exports = mongoose.model("Airport", Airport);
