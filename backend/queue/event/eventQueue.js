// jshint ignore: start
import { Queue, Worker } from "bullmq";
import { WebhookQueue } from "../webhook/index.js";
import config from "../../config/index.js";
import Flight from "../../models/flight.js";
import Booking from "../../models/booking.js";
import { logger } from "../../utils/index.js";

class EventQueue {
  // queue
  #queue = undefined;

  // name of queue
  #queueName = "eventQueue";

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
      for (let i = config.EVENT_WORKERS; i > 0; i--) this.#spawnWorker();
    }
  }

  // creates a worker
  #spawnWorker() {
    const worker = new Worker(this.#queueName, this.#processor, {
      connection: { ...this.#connection },
      concurrency: 1,
    });

    // register error handler
    worker.on("error", (err) => {
      // log the error
      console.error(err);
    });
  }

  // job processor
  async #processor(job) {
    try {
      await job.log("Starting to process job");

      // extract data
      const { flightId, bookingId, event, createdAt, isDeparture } = job.data;

      // get  departure flight
      const docFlight = await Flight.findOne({ _id: flightId });

      // get booking
      const docBooking = await Booking.findOne({ _id: bookingId });

      await job.log("Retrieve MongoDB data");

      if (docFlight === null || docBooking === null)
        return "No Webhooks to Process";

      // extract data
      const { _webhooks } = docFlight;
      const { departureFlight, returnFlight } = docBooking;

      // retrieve relevant webhooks
      const filteredWebhooks = _webhooks.filter((x) => x.event === event);

      // create jobs
      const jobs = filteredWebhooks.map(({ callbackURL }) => {
        return {
          name: "webhookJob",
          data: {
            ...(isDeparture ? departureFlight : returnFlight),
            callbackURL,
            event,
            createdAt,
          },
        };
      });

      // add jobs to queue
      await WebhookQueue.addBulk(jobs);
    } catch (err) {
      return err.toString();
    }

    return "Event Queue Class Finished Task";
  }

  // getter
  get queueInstance() {
    return this.#queue;
  }

  // adds job to queue
  async add(departureFlightId, returnFlightId, roundtrip, bookingId, event) {
    // add flight to queue
    await this.#queue.add(constants.QUEUE_JOB.EVENT, {
      departureFlightId,
      returnFlightId,
      roundtrip,
      bookingId,
      event,
    });

    // log number of workers
    logger.info(
      `NUMBER OF EVENT WORKERS: ${(await this.#queue.getWorkers()).length}`
    );
  }

  // adds job to queue
  async addBulk(jobs) {
    // add bulk jobs
    await this.#queue.addBulk(jobs);

    // log number of workers
    logger.info(
      `NUMBER OF WEBHOOK WORKERS: ${(await this.#queue.getWorkers()).length}`
    );
  }
}

// how to create a singleton: https://www.sitepoint.com/javascript-design-patterns-singleton/
const singleton = new EventQueue();
Object.freeze(singleton);

export default singleton;
