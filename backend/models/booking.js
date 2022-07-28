import mongoose from "mongoose";
import { BookingSchema } from "../schemas/index.js";
import constants from "../constants/index.js";
import {BookingQueue, EventQueue} from "../queue/index.js";

const generateEventQueueJobs = (
  docFlight,
  bookingId,
  createdAt,
  isDeparture
) => {
  if (docFlight === undefined || docFlight.flightId === undefined) return [];

  /* Jobs to add to Event Queue */
  const jobs = [];

  /* Event Queue Data */
  const eventQueueData = {
    flightId: docFlight.flightId,
    bookingId,
    isDeparture,
    createdAt,
  };

  // add FLIGHT_BOOKING event job
  jobs.push({
    name: constants.QUEUE_JOB.EVENT,
    data: {
      ...eventQueueData,
      event: constants.WEBHOOK_EVENT.FLIGHT_BOOKING,
    },
  });

  // add additional job based on seat class
  if (docFlight.class === constants.FLIGHT_CLASS.FIRST_CLASS)
    jobs.push({
      name: constants.QUEUE_JOB.EVENT,
      data: {
        ...eventQueueData,
        event: constants.WEBHOOK_EVENT.FLIGHT_BOOKING_FIRST_CLASS,
      },
    });
  else if (docFlight.class === constants.FLIGHT_CLASS.BUSINESS)
    jobs.push({
      name: constants.QUEUE_JOB.EVENT,
      data: {
        ...eventQueueData,
        event: constants.WEBHOOK_EVENT.FLIGHT_BOOKING_BUSINESS,
      },
    });
  else
    jobs.push({
      name: constants.QUEUE_JOB.EVENT,
      data: {
        ...eventQueueData,
        event: constants.WEBHOOK_EVENT.FLIGHT_BOOKING_ECONOMY,
      },
    });

  return jobs;
};

// generate and schedule event queue jobs
const scheduleEventQueueJobs = async (doc) => {
  const { departureFlight, returnFlight, _id, createdAt } = doc;

  // generate departure jobs
  const departureJobs = generateEventQueueJobs(
    departureFlight,
    _id.toString(),
    createdAt,
    true
  );

  // generate return jobs
  const returnJobs = generateEventQueueJobs(
    returnFlight,
    _id.toString(),
    createdAt,
    false
  );

  // add jobs to queue
  await EventQueue.addBulk(departureJobs.concat(returnJobs));
};

// define hook on creation
BookingSchema.post("save", async (doc) => {
  // add event queue jobs
  await scheduleEventQueueJobs(doc);

  // add booking queue jobs
  await BookingQueue.add(doc);
});

export default mongoose.model("Booking", BookingSchema);
