// jshint ignore: start
import { Queue, Worker } from "bullmq";
import config from "../../config/index.js";
import { logger } from "../../utils/index.js";
import User from "../../models/user.js";
import Flight from "../../models/flight.js";
import {
  loadBookingReceipt,
  loadFlightTicket,
  sendBookingEmail,
} from "../../api/helpers/pdfGenerationAndEmail.js";

class BookingQueue {
  // queue
  #queue = undefined;

  // name of queue
  #queueName = "boookingsQueue";

  // connection obj
  #connection = {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
  };

  constructor() {
    // singleton instance of queue
    if (this.#queue === undefined) {
      this.#queue = new Queue(this.#queueName, {
        connection: this.#connection,
      });

      // spawn workers
      for (let i = config.BOOKING_WORKERS; i > 0; i--) this.#spawnWorker();
    }
  }

  // spawns a worker
  #spawnWorker() {
    const worker = new Worker(this.#queueName, this.#processor, {
      connection: { ...this.#connection },
      concurrency: 1,
      lockDuration: 600000, // 10 minutes
    });

    // register error handler
    worker.on("error", (err) => {
      // log the error
      console.error(err);
      return err.toString();
    });
  }

  // job processor
  async #processor(job) {
    try {
      await job.log("Starting to process job");

      // get booking
      const docBooking = job.data;

      if (docBooking === null) {
        await job.moveToFailed("Booking record is not valid");
        return "Failed";
      }

      // get user
      const docUser = await User.findOne({ email: docBooking.userId });

      await job.log("Retrieved user data from database");

      if (docUser === null) {
        await job.moveToFailed("User not found");
        return "Failed";
      }

      await job.log("Retrieving booking receipt");
      
      // get receipt
      const receipt = await loadBookingReceipt(docBooking, docUser);

      await job.log("Retrieved booking receipt");

      // get departure flight and retrieve ticket
      const docDepartureFlight = await Flight.findOne({
        _id: docBooking.departureFlight.flightId,
      });

      await job.log("Retrieved departure flight from mongoDB");

      if (docDepartureFlight === null) {
        await job.moveToFailed("Flight not found");
        return "Failed";
      }

      const departureTicket = await loadFlightTicket(
        docBooking,
        docUser,
        docDepartureFlight,
        true
      );

      // if booking includes roundtrip flight, generate return ticket
      // send email with generated documents
      if (docBooking.roundtrip) {
        const docReturnFlight = await Flight.findOne({
          _id: docBooking.returnFlight.flightId,
        });
        if (docReturnFlight === null) {
          await job.moveToFailed("Return flight not found");
          return "Failed";
        }
        const returnTicket = await loadFlightTicket(
          docBooking,
          docUser,
          docReturnFlight,
          false
        );
        await sendBookingEmail(
          docUser.email,
          receipt,
          departureTicket,
          returnTicket
        );
      } else {
        await sendBookingEmail(docUser.email, receipt, departureTicket, null);
      }
    } catch (err) {
      return err.toString();
    }

    // finish task
    return "Booking Queue Class Finished Task";
  }

  // getter
  get queueInstance() {
    return this.#queue;
  }

  // adds job to queue
  async add(doc) {
    await this.#queue.add("bookingJob", doc);

    // log number of workers
    logger.info(
      `NUMBER OF BOOKING WORKERS: ${(await this.#queue.getWorkers()).length}`
    );
  }

  // adds job to queue
  async addBulk(jobs) {
    // add bulk jobs
    await this.#queue.addBulk(jobs);

    // log number of workers
    logger.info(
      `NUMBER OF BOOKING WORKERS: ${(await this.#queue.getWorkers()).length}`
    );
  }
}

// how to create a singleton: https://www.sitepoint.com/javascript-design-patterns-singleton/
const singleton = new BookingQueue();
Object.freeze(singleton);

export default singleton;
