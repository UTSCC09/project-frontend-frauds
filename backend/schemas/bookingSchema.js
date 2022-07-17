import mongoose from "mongoose";
import { Flight } from "../models/index.js";
const { Schema, Types } = mongoose;

const BookingSchema = new Schema(
  {
    userId: String,
    departureFlight: {
      flightId: String,
      class: {
        type: Number,
        enum: [1, 2, 3],
        default: 3,
      },
      classDescription: {
        type: String,
        enum: ["First Class", "Business", "Economy"],
        default: "Economy",
      },
      seat: {
        x: Number,
        y: Number,
      },
    },
    returnFlight: {
      flightId: String,
      class: {
        type: Number,
        enum: [1, 2, 3],
      },
      classDescription: {
        type: String,
        enum: ["First Class", "Business", "Economy"],
      },
      seat: {
        x: Number,
        y: Number,
      },
    },
    roundtrip: Boolean,
    cost: Number,
    taxRate: Number,
    totalPaid: Number,
    currency: {
      type: String,
      enum: ["CAD"],
      default: "CAD",
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
      async addBooking(
        userId,
        departureFlight,
        roundtrip,
        cost,
        taxRate,
        totalPaid,
        currency,
        returnFlight = null
      ) {
        // locate departure flight
        const docDeparture = await Flight.findOne({
          _id: Types.ObjectId(departureFlight.flightId),
        });

        // get seat map
        const seatMap = [...docDeparture.equipmentListData.seats];

        // update seats for departure flight as booked
        seatMap[departureFlight.seat.x][departureFlight.seat.y] = 0;

        // update flights seats data
        const resp = await Flight.updateOne(
          { _id: Types.ObjectId(docDeparture._id) },
          { $set: { "equipmentListData.seats": seatMap } }
        );

        // create booking
        await this.create({
          userId,
          roundtrip,
          cost,
          taxRate,
          totalPaid,
          currency,
          departureFlight,
          returnFlight,
        });
      },
    },
  }
);

export default BookingSchema;
