import express from "express";
import { Flight } from "../../models/index.js";
import { checkSchema } from "express-validator";
import {
  addFlightValidator,
  retrieveFlightsValidator,
} from "../validators/index.js";
import validateSchema from "../middlewares/validateSchemaMiddleware.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// search
router.post(
  "/",
  checkSchema(addFlightValidator),
  validateSchema,
  asyncHandler(async ({ body }, res) => {
    // add flight
    await Flight.addFlight(
      body.routeId,
      body.planeId,
      body.departureTime,
      body.arrivalTime,
      body.duration,
      body.price
    );

    // send success message
    res.json({ message: "flight added to system" });
  })
);

// flights
router.get(
  "/",
  checkSchema(retrieveFlightsValidator),
  validateSchema,
  asyncHandler(async ({ query }, res) => {
    const { sourceAirport, destAirport, departureDate } = query;

    // retrieve one-way flights
    res.json({
      data: await Flight.findOneWayFlights(
        sourceAirport,
        destAirport,
        departureDate
      ),
    });
  })
);

export default router;
