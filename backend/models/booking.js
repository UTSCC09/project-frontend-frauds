import mongoose from "mongoose";
import { BookingSchema } from "../schemas/index.js";
import { WebhookEvent } from "../constants/index.js";
import { EventQueue } from "../queue/index.js";

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
