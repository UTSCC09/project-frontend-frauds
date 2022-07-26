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

// POST: add flight to system
router.post(
  "/",
  checkSchema(addFlightValidator),
  validateSchema,
  asyncHandler(async ({ body }, res) => {
    // add flight
    const { _id } = await Flight.addFlight(
      body.routeId,
      body.planeId,
      body.departureTime,
      body.arrivalTime,
      body.duration,
      body.price
    );

    // send success message
    res.json({ message: `flight added to system with id ${_id}` });
  })
);

// GET: flights
router.get(
  "/oneway",
  checkSchema(retrieveFlightsValidator),
  validateSchema,
  asyncHandler(async ({ query }, res) => {
    const { sourceAirport, destAirport, departureDate, limit, page } = query;

    const { data, metadata, links } = await Flight.findOneWayFlights(
      sourceAirport,
      destAirport,
      departureDate,
      page,
      limit
    );

    // return one-way flights
    res.json({
      data,
      metadata,
      links,
    });
  })
);

export default router;
