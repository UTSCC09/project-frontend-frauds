import mongoose from "mongoose";
const { Schema } = mongoose;
import { Route } from "../models/index.js";
import { AirlineSchema, PlaneSchema, AirportSchema } from "./index.js";
import {
  timestampGetEndOfDay,
  timestampGetStartOfDay,
} from "../utils/index.js";

const Flight = new mongoose.Schema(
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
        const count = await this.estimatedDocumentCount({});
        const docs = await this.find({})
          .sort({ name: 1 })
          .skip(page * limit)
          .limit(limit);

        return { count, docs };
      },
      async addFlight(
        routeId,
        planeId,
        departureTime,
        arrivalTime,
        duration,
        price
      ) {
        // find current route
        const {
          airlineData,
          sourceAirportData,
          destAirportData,
          equipmentListData,
        } = await Route.findOne({
          routeId,
        });

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
