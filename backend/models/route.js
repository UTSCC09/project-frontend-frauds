const mongoose = require("mongoose");
const { Schema } = mongoose;

const Route = new Schema({
  airline: String,
  airlineId: Number,
  sourceAirport: String,
  sourceAirportId: String,
  destAirport: String,
  destAirportId: String,
  codeshare: String,
  stops: String,
  equipment: {
    type: String,
    get: (v) => v.split(" "),
  },
});

module.exports = mongoose.model("Route", Route);
