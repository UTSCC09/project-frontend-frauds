import express from "express";
import { Booking } from "../../models/index.js";
import { checkSchema } from "express-validator";
import { addBookingValidator } from "../validators/index.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import { loadBookingReceipt } from "../api/helpers/pdfGenerationAndEmail.js";
import asyncHandler from "express-async-handler";
import {
  authorizeAccessToken,
  authorizeRole,
} from "../middlewares/validateTokenMiddleware.js";
import createError from "http-errors";
import User from "../../models/user.js";

const router = express.Router();

// POST: create booking
router.post(
  "/",
  authorizeAccessToken,
  authorizeRole(["user"]),
  checkSchema(addBookingValidator),
  validateSchema,
  asyncHandler(async (req, res) => {
    const userId = req.auth.email;
    const {
      departureFlight,
      returnFlight,
      roundtrip,
      cost,
      taxRate,
      totalPaid,
      currency,
    } = req.body;

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

// GET: Retrieve booking receipt
router.get(
  "/:id/receipt/",
  authorizeAccessToken,
  authorizeRole(["user"]),
  asyncHandler(async (req, res, next) => {
    if (req.auth.email !== null) {
      console.log(req.auth.email);

      const docBooking = await Booking.findOne({ _id: req.params.id });
      const docUser = await User.findUser(docBooking.userId);

      const file = new Blob([loadBookingReceipt(docBooking, docUser)], {
        type: "application/pdf",
      });
      const fileURL = URL.createObjectURL(file);

      res.download(fileURL);
    } else {
      return next(createError(400, "No email in token"));
    }
  })
);

export default router;
