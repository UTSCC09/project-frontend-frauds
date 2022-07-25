import createError from "http-errors";
import { Flight } from "../models/index.js";
import mongoose from "mongoose";
const { Schema, Types } = mongoose;
import { WebhookEvent } from "../constants/index.js";
import { EventQueue } from "../queue/index.js";

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
    createdAt: Number,
    updatedAt: Number,
  },
  {
    // mongoose use UNIX timestamps: https://masteringjs.io/tutorials/mongoose/timestamps
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
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
        const depData = await validateSeatHelper(departureFlight);

        let returnData;
        if (roundtrip) returnData = await validateSeatHelper(returnFlight);

        // reserve departure seats
        await Flight.updateOne(
          { _id: Types.ObjectId(depData.doc._id) },
          { $set: { "equipmentListData.seats": depData.seats } }
        );

        // reserve return seats
        if (roundtrip)
          await Flight.updateOne(
            { _id: Types.ObjectId(returnData.doc._id) },
            { $set: { "equipmentListData.seats": returnData.seats } }
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

// define hook on creation
BookingSchema.post("save", async ({ departureFlight, _id }) => {
  // add event to queue
  await EventQueue.add(
    departureFlight.flightId.toString(),
    _id,
    WebhookEvent.FLIGHT_BOOKING
  );
});

export default mongoose.model("Booking", BookingSchema);
