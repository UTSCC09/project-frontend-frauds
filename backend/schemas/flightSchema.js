import mongoose from "mongoose";
const { Schema } = mongoose;
import { Route } from "../models/index.js";
import { AirlineSchema, PlaneSchema, AirportSchema } from "./index.js";
import {
  timestampGetEndOfDay,
  timestampGetStartOfDay,
} from "../utils/index.js";
import createError from "http-errors";

const Flight = new Schema(
  {
    routeId: String,
    planeId: String,
    departureTime: Number,
    arrivalTime: Number,
    duration: Number,
    price: {
      economy: Number,
      business: Number,
      firstClass: Number,
    },
    airlineData: AirlineSchema,
    sourceAirportData: AirportSchema,
    destAirportData: AirportSchema,
    equipmentListData: PlaneSchema,
  },
  {
    statics: {
      async paginate(page = 0, limit = 10) {
        const total = await this.estimatedDocumentCount({});
        const docs = await this.find({})
          .sort({ name: 1 })
          .skip(page * limit)
          .limit(limit);
        return { total, docs, count: docs.length };
      },
      async addFlight(
        routeId,
        planeId,
        departureTime,
        arrivalTime,
        duration,
        price
      ) {
        // invalid flight time
        if (departureTime >= arrivalTime)
          throw createError(400, "Departure time must precede arrival time");
        else if (
          price.firstClass < price.business ||
          price.firstClass < price.economy ||
          price.business < price.economy
        )
          throw createError(
            400,
            "Higher class seats cannot be cheaper than lower class seats"
          );

        // find current route
        const doc = await Route.findOne({ routeId });

        // route not valid
        if (doc === null) throw createError(404, `Route ${routeId} not found`);

        const {
          airlineData,
          sourceAirportData,
          destAirportData,
          equipmentListData,
        } = doc;

        // check route $lookup data is properly provided
        if (
          !airlineData.length ||
          !sourceAirportData.length ||
          !destAirportData.length ||
          !equipmentListData.length
        )
          throw createError(
            400,
            "Route is not valid, please choose another one"
          );

        // create flight
        await this.create({
          routeId,
          planeId,
          departureTime,
          arrivalTime,
          duration,
          price,
          airlineData: airlineData[0],
          sourceAirportData: sourceAirportData[0],
          destAirportData: destAirportData[0],
          equipmentListData: equipmentListData[0],
        });
      },
      async findOneWayFlights(sourceAirport, destAirport, departureTime) {
        return await this.aggregate([
          {
            $match: {
              "sourceAirportData.iata": sourceAirport,
            },
          },
          {
            $match: {
              "destAirportData.iata": destAirport,
            },
          },
          {
            $match: {
              $and: [
                {
                  departureTime: {
                    $gte: timestampGetStartOfDay(departureTime),
                  },
                },
                {
                  departureTime: { $lte: timestampGetEndOfDay(departureTime) },
                },
              ],
            },
          },
        ]);
      },
    },
  }
);

export default Flight;
