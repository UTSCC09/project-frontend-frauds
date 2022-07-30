// jshint ignore: start
import {Queue, Worker} from "bullmq";
import config from "../../config/index.js";
import {logger} from "../../utils/index.js";
import Booking from "../../models/booking.js";
import User from "../../models/user.js";
import Flight from "../../models/flight.js";
import { loadBookingReceipt, loadFlightTicket, sendBookingEmail } from "../../api/helpers/pdfGenerationAndEmail.js"

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
            connection: {...this.#connection},
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

        // get booking
        const docBooking =
            job.data; /*await Booking.findOne({ _id: job.data.bookingId });*/

        await job.log("Retrieved data from mongoDB");

        if (docBooking === null) {
            await job.moveToFailed("Booking record is not valid");
            return "Failed";
        }

        const docUser = await User.findOne({_id: docBooking.userId});

        // get receipt
        const receipt = loadBookingReceipt(docBooking, docUser);

        // get departure flight and retrieve ticket
        const docDepartureFlight = await Flight.findOne({_id: docBooking.departureFlight.flightId});
        const departureTicket = loadFlightTicket(docBooking, docUser, docDepartureFlight, true);

        if (docBooking.roundtrip){
            const docReturnFlight = await Flight.findOne({_id: docBooking.returnFlight.flightId});
            const returnTicket = loadFlightTicket(docBooking, docUser, docReturnFlight, false);
            sendBookingEmail(docUser.email, receipt, departureTicket, returnTicket);
        } else {
            sendBookingEmail(docUser.email, receipt, departureTicket, null)
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
