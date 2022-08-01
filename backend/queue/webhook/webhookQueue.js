// jshint ignore: start
import { Queue, Worker } from "bullmq";
import config from "../../config/index.js";
import axios from "axios";
import { logger } from "../../utils/index.js";
import constants from "../../constants/index.js";

class WebhookQueue {
  // queue
  #queue = undefined;

  // name of queue
  #queueName = "webhookQueue";

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
      for (let i = config.WEBHOOK_WORKERS; i > 0; i--) this.#spawnWorker();
    }
  }

  // spawns a worker
  #spawnWorker() {
    const worker = new Worker(this.#queueName, this.#processor, {
      connection: { ...this.#connection },
      concurrency: 1,
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

      // extract fields
      const { callbackURL, ...body } = job.data;

      // broadcast webhook
      await axios.post(callbackURL, body);

      await job.log("Callback Sent");
    } catch (err) {
      return err.toString();
    }

    // finish task
    return "Webhook Queue Class Finished Task";
  }

  // getter
  get queueInstance() {
    return this.#queue;
  }

  // adds job to queue
  async add(flightId, event) {
    await this.#queue.add(constants.QUEUE_JOB.WEBHOOK, {
      data: { flightId, event },
    });

    // log number of workers
    logger.info(
      `NUMBER OF WEBHOOK WORKERS: ${(await this.#queue.getWorkers()).length}`
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
const singleton = new WebhookQueue();
Object.freeze(singleton);

export default singleton;
