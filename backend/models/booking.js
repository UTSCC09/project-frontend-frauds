import mongoose from "mongoose";
import { BookingSchema } from "../schemas/index.js";
import { WebhookEvent } from "../constants/index.js";
import { EventQueue } from "../queue/index.js";

// define hook on creation
BookingSchema.post("save", async (doc) => {

  // add event to queue
  await EventQueue.add(
    doc.departureFlight.flightId.toString(),
    doc.returnFlight.flightId?.toString(),
    doc.roundtrip,
    doc._id.toString(),
    WebhookEvent.FLIGHT_BOOKING
  );
});

export default mongoose.model("Booking", BookingSchema);
