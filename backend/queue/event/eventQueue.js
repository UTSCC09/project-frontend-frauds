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

  // renders jobs for flight webhooks
  async #generateWebhookJobs(docFlight, docBooking, event, isDeparture) {
    if (docFlight === undefined || docBooking === undefined) return;

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
        },
      };
    });

    // add jobs to queue
    await WebhookQueue.addBulk(jobs);
  }

  // job processor
  async #processor(job) {
    await job.log("Starting to process job");

    // extract data
    const { departureFlightId, returnFlightId, roundtrip, bookingId, event } =
      job.data;

    // get  departure flight
    const docDepartureFlight = await Flight.findOne({ _id: departureFlightId });

    // get booking
    const docBooking = await Booking.findOne({ _id: bookingId });

    // define function to generate webhook jobs
    const _generateWebhookJobs = async (
      docFlight,
      docBooking,
      event,
      isDeparture
    ) => {
      if (docFlight === undefined || docBooking === undefined) return;

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
          },
        };
      });

      // add jobs to queue
      await WebhookQueue.addBulk(jobs);
    };

    // process webhook jobs for departure flight
    await _generateWebhookJobs(docDepartureFlight, docBooking, event, true);

    // process roundtrip
    if (roundtrip) {
      // retrieve return flight
      const docReturnFlight = await Flight.findOne({ _id: returnFlightId });

      // process webhook jobs for return flight
      await _generateWebhookJobs(docReturnFlight, docBooking, event, false);
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
    await this.#queue.add("eventJob", {
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
}

// how to create a singleton: https://www.sitepoint.com/javascript-design-patterns-singleton/
const singleton = new EventQueue();
Object.freeze(singleton);

export default singleton;
