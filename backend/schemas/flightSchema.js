import mongoose from "mongoose";
const { Schema } = mongoose;

const Flight = new mongoose.Schema(
  {
    routeId: String,
    planeId: String,
    departureTime: Number,
    arrivalTime: Number,
    duration: Number,
    price: {
      economy: Schema.Types.Decimal128,
      business: Schema.Types.Decimal128,
      firstClass: Schema.Types.Decimal128,
    },
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
      async addFlight(
        routeId,
        planeId,
        departureTime,
        arrivalTime,
        duration,
        price
      ) {
        const resp = await this.create({
          routeId,
          planeId,
          departureTime,
          arrivalTime,
          duration,
          price,
        });
      },
    },
  }
);

export default Flight;
