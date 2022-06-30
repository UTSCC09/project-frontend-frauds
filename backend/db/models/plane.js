import mongoose from "mongoose";
const { Schema } = mongoose;

const Plane = new Schema({
  name: String,
  iata: String,
  icao: String,
  passengerCapacity: Number,
  seats: [[]],
});

exports.module = mongoose.model("Plane", Plane);
