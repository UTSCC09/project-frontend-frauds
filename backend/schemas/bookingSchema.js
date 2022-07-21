import createError from "http-errors";
import mongoose from "mongoose";
import { Flight } from "../models/index.js";
const { Schema, Types } = mongoose;

// validates flight seats
const validateSeatHelper = async (flight) => {
  // locate departure flight
  const doc = await Flight.findOne({
    _id: Types.ObjectId(flight.flightId),
  });

  // invalid departure flight
  if (doc === null) throw createError(400, "Departure flight doesn't exist");

  // get seat map
  const seatMap = [...doc.equipmentListData.seats];
  const seatValue = seatMap[flight.seat.x][flight.seat.y];

  // cannot reserve barrier seat
  if (seatValue === -1)
    throw createError(400, "Chosen seat is not a valid seat");
  else if (seatValue === 0) throw createError(400, "Seat already reserved");

  // update seats for departure flight as booked
  seatMap[flight.seat.x][flight.seat.y] = 0;

  return { seats: seatMap, doc };
};

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
        const total = await this.estimatedDocumentCount({});
        const docs = await this.find({})
          .sort({ name: 1 })
          .skip(page * limit)
          .limit(limit);
        return { total, docs, count: docs.length };
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
        // validate seats for these flights
        const { seats: depSeats, doc: depDoc } = await validateSeatHelper(
          departureFlight
        );
        const { seats: returnSeats, doc: returnDoc } = await validateSeatHelper(
          returnFlight
        );

        // reserve departure seats
        await Flight.updateOne(
          { _id: Types.ObjectId(depDoc._id) },
          { $set: { "equipmentListData.seats": depSeats } }
        );

        // reserve return seats
        await Flight.updateOne(
          { _id: Types.ObjectId(returnDoc._id) },
          { $set: { "equipmentListData.seats": returnSeats } }
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
