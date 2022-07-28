// jshint ignore: start
import { Queue, Worker } from "bullmq";
import config from "../../config/index.js";
import { logger } from "../../utils/index.js";
import Booking from "../../models/booking.js";
import Flight from "../../models/flight.js";
import fs from "fs";
import {PDFDocument} from "pdf-lib";
import nodemailer from "nodemailer";

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

        if (docBooking === undefined) {
            await job.moveToFailed("Booking record is not valid");
            return "Failed";
        }

        const { userId, departureFlight, returnFlight, roundTrip, cost, taxRate, totalPaid, currency, createdAt } = docBooking;

        // pdf generation and emailing logic, need to refactor
        fs.readFile("Travel Receipt Template.pdf", async (err, data) => {
            if (err) {
                return "Failed to read file.";
            }
            const pdfDoc = await PDFDocument.load(data);
            const form = pdfDoc.getForm();

            const bookingNumberField = form.getTextField("Booking Number");
            const preparedForNameField = form.getTextField("Prepared for");
            const emailField = form.getTextField("Email");
            const dateField = form.getTextField("Date");
            const roundTripField = form.getCheckBox("Roundtrip");
            const currencyField = form.getTextField("Currency");
            const subTotalField = form.getTextField("Sub Total");
            const taxField = form.getTextField("Tax");
            const grandTotalField = form.getTextField("Grand Total");

            bookingNumberField.setText(docBooking._id);
            preparedForNameField.setText(await User.findOne({ _id: userId }).name);
            emailField.setText(await User.findOne({ _id: userId }).name);
            dateField.setText(new Date(createdAt).toLocaleDateString('en-us', {
                year: "numeric",
                month: "short",
                day: "numeric"
            }));
            if (roundTrip) roundTripField.check();
            currencyField.setText(currency.type);
            subTotalField.setText(cost.toString());
            taxField.setText(taxRate.toString());
            grandTotalField.setText(totalPaid.toString());

            const pdfBytes = await pdfDoc.save();

            // emailing: refactor
            let transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "auto-emailer@airtoronto-backend-dev.xyz",
                    pass: "Ovn3IbOFvGbA6CXLXlSldAUPJ"
                }
            });

            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Server is ready to send emails");
                }
            });

            let mailOptions = {
                from: "auto-emailer@airtoronto-backend-dev.xyz",
                to: "jasongu508@gmail.com",
                subject: "Flight Ticket",
                text: "Here is your flight ticket!",
                attachments: [{
                    filename: "receipt.pdf",
                    contentType: "application/pdf",
                    content: pdfBytes
                }]
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        });

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
