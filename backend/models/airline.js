import mongoose from "mongoose";
const { Schema } = mongoose;

const Airline = new Schema(
  {
    airlineId: String,
    name: String,
    alias: String,
    iata: String,
    icao: String,
    callsign: String,
    country: String,
    active: String,
  },
  {
    statics: {
      async paginate(page = 0, limit = 10) {
        const count = await this.estimatedDocumentCount({});
        const docs = await this.find({})
          .sort({ name: 1 })
          .skip(page * limit)
          .limit(limit);
        return { count, docs };
      },
    },
  }
);

export default mongoose.model("Airline", Airline);
