import express from "express";
import { Booking } from "../../models/index.js";
import { checkSchema } from "express-validator";
import { addBookingValidator } from "../validators/index.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// POST: create booking
router.post(
  "/",
  checkSchema(addBookingValidator),
  validateSchema,
  asyncHandler(async ({ body }, res) => {
    const {
      userId,
      departureFlight,
      returnFlight,
      roundtrip,
      cost,
      taxRate,
      totalPaid,
      currency,
    } = body;

    // add booking
    await Booking.addBooking(
      userId,
      departureFlight,
      roundtrip,
      cost,
      taxRate,
      totalPaid,
      currency,
      returnFlight
    );

    // send response
    res.json({
      message: "Booking successfully completed",
    });
  })
);

export default router;