import express from "express";
import { Booking } from "../../models/index.js";
import { checkSchema } from "express-validator";
import { addBookingValidator } from "../validators/index.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import asyncHandler from "express-async-handler";
import {
  authorizeAccessToken,
  authorizeRole,
} from "../middlewares/validateTokenMiddleware.js";
import createError from "http-errors";

const router = express.Router();

// POST: create booking
router.post(
  "/",
  authorizeAccessToken,
  authorizeRole(["user"]),
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

// GET: Get booking
router.get(
  "/",
  authorizeAccessToken,
  authorizeRole(["user"]),
  asyncHandler(async (req, res, next) => {
    if (req.auth.email !== null) {
      console.log(req.auth.email);
      const bookings = await Booking.getBooking(req.auth.email);
      res.json(bookings);
    } else {
      return next(createError(400, "No email in token"));
    }
  })
);

export default router;
