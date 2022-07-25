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

  // worker
  #worker = undefined;

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

      // spawn 5 workers
      for (let i = 10; i > 0; i--) this.#spawnWorker();
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
    await job.log("Starting to process job");

    // extract data
    const { flightId, bookingId, event } = job.data;

    // get flight
    const docFlight = await Flight.findOne({ _id: flightId });

    // get booking
    const docBooking = await Booking.findOne({ _id: bookingId });

    await job.log("Retrieved data from mongoDB");

    if (docFlight === undefined || docBooking === undefined) {
      job.moveToFailed("Flight event is not valid");
      return "Failed";
    }

    // webhooks
    const { _webhooks } = docFlight;

    // no webhooks
    if (_webhooks === undefined || _webhooks.length === 0)
      return "No webhooks registered";

    // filter to relevant events
    const webhooks = _webhooks.filter((x) => x.event === event);

    // retrieve booking flights
    const { departureFlight, returnFlight } = docBooking;

    if (departureFlight.flightId === flightId) {
      await job.log("Flight was the departure flight");

      // create jobs
      const jobs = webhooks.map(({ callbackURL }) => {
        return {
          name: "webhookJob",
          data: { ...departureFlight, callbackURL },
        };
      });

      // add jobs to queue
      await WebhookQueue.addBulk(jobs);
    } else {
      await job.log("Flight was the return flight");

      // create jobs
      const jobs = webhooks.map(({ callbackURL }) => {
        return { name: "webhookJob", data: { ...returnFlight, callbackURL } };
      });

      // add jobs to queue
      await WebhookQueue.addBulk(jobs);
    }

    return "Event Queue Class Finished Task";
  }

  // getter
  get queueInstance() {
    return this.#queue;
  }

  // adds job to queue
  async add(flightId, bookingId, event) {
    await this.#queue.add("eventJob", { flightId, bookingId, event });

    // log number of workers
    logger.info(`NUMBER OF EVENT WORKERS: ${(await this.#queue.getWorkers()).length}`);
  }
}

// how to create a singleton: https://www.sitepoint.com/javascript-design-patterns-singleton/
const singleton = new EventQueue();
Object.freeze(singleton);

export default singleton;
