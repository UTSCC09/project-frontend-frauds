import mongoose from "mongoose";
const { Schema } = mongoose;

const Plane = new Schema(
  {
    name: String,
    iata: String,
    icao: String,
    passengerCapacity: Number,
    seats: [[]],
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

export default mongoose.model("Plane", Plane);
