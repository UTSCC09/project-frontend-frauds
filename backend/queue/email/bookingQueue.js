// jshint ignore: start
import { Queue, Worker } from "bullmq";
import config from "../../config/index.js";
import { logger } from "../../utils/index.js";
import Booking from "../../models/booking.js";
import Flight from "../../models/flight.js";

class BookingQueue {
    // queue
    #queue = undefined;

    // name of queue
    #queueName = "bookingQueue";

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
        const { bookingId } = job.data;

        // get booking
        const docBooking = await Booking.findOne({ _id: bookingId });

        await job.log("Retrieved data from mongoDB");



        // finish task
        return "Booking Queue Class Finished Task";
    }

    // getter
    get queueInstance() {
        return this.#queue;
    }

    // adds job to queue
    async add(bookingId) {
        await this.#queue.add("bookingJob", { data: { bookingId} });

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
