import mongoose from "mongoose";
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

exports.module = mongoose.model("Airline", Airline);
