// jshint ignore: start
import {Queue, Worker, QueueScheduler} from "bullmq";
import config from "../../config/index.js";
import {logger} from "../../utils/index.js";
import User from "../../models/user.js";
import {sendRegistrationEmail} from "../../api/helpers/pdfGenerationAndEmail.js";

class RegistrationQueue {
    // queue
    #queue = undefined;

    // name of queue
    #queueName = "registrationQueue";

    // connection obj
    #connection = {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
    };

    constructor() {
        // singleton instance of queue
        if (this.#queue === undefined) {
            new QueueScheduler(this.#queueName, {
                connection: this.#connection,
            })
            this.#queue = new Queue(this.#queueName, {
                connection: this.#connection,
            });

            // spawn workers
            for (let i = config.REGISTRATION_WORKERS; i > 0; i--) this.#spawnWorker();
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

        // get user
        const docUser = job.data;

        await job.log("Retrieved data from mongoDB");

        if (docUser === null) {
            await job.moveToFailed("User not found");
            return "Failed";
        }

        await sendRegistrationEmail(docUser);

        // finish task
        return "Registration Queue Class Finished Task";
    }

    // getter
    get queueInstance() {
        return this.#queue;
    }

    // adds job to queue
    async add(doc) {
        await this.#queue.add("registrationJob", doc, {delay: 300000});

        // log number of workers
        logger.info(
            `NUMBER OF REGISTRATION WORKERS: ${(await this.#queue.getWorkers()).length}`
        );
    }

    // adds job to queue
    async addBulk(jobs) {
        // add bulk jobs
        await this.#queue.addBulk(jobs);

        // log number of workers
        logger.info(
            `NUMBER OF REGISTRATION WORKERS: ${(await this.#queue.getWorkers()).length}`
        );
    }
}

// how to create a singleton: https://www.sitepoint.com/javascript-design-patterns-singleton/
const singleton = new RegistrationQueue();
Object.freeze(singleton);

export default singleton;
