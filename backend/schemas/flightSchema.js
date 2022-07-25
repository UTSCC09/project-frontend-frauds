import mongoose from "mongoose";
const { Schema, Types } = mongoose;
import { Route } from "../models/index.js";
import { AirlineSchema, PlaneSchema, AirportSchema } from "./index.js";
import {
  generatePaginationLinks,
  timestampGetEndOfDay,
  timestampGetStartOfDay,
} from "../utils/index.js";
import createError from "http-errors";
import config from "../config/index.js";

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
    createdAt: Number,
    updatedAt: Number,
    _webhooks: [
      {
        event: String,
        callbackURL: String,
        userId: String,
        _id: false,
      },
    ],
  },
  {
    // mongoose use UNIX timestamps: https://masteringjs.io/tutorials/mongoose/timestamps
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    statics: {
      async paginate(page = 0, limit = 10) {
        const total = await this.estimatedDocumentCount({});
        const docs = await this.find({})
          .sort({ name: 1 })
          .skip(page * limit)
          .limit(limit);
        return { total, docs, count: docs.length };
      },
      async subscribeWebhook(event, callbackURL, userId, flightId) {
        // create object to add to webhooks array
        const webhookObject = { event, callbackURL, userId };

        // search for flight
        const { matchedCount, modifiedCount } = await this.updateOne(
          { _id: Types.ObjectId(flightId) },
          { $addToSet: { _webhooks: webhookObject } }
        );

        if (matchedCount !== 1)
          throw createError(404, `Flight with id ${flightId} not found`);
        else if (modifiedCount !== 1)
          throw createError(400, `Failed to register webhook`);
      },
      async unsubscribeWebhook(event, callbackURL, userId, flightId) {
        // create object to remove from webhooks array
        const webhookObject = { event, callbackURL, userId };

        // search for flight
        const { matchedCount, modifiedCount } = await this.updateOne(
          { _id: Types.ObjectId(flightId) },
          { $pull: { _webhooks: webhookObject } }
        );

        if (matchedCount !== 1)
          throw createError(404, `Flight with id ${flightId} not found`);
        else if (modifiedCount !== 1)
          throw createError(400, `Failed to register webhook`);
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
        return await this.create({
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
      async findOneWayFlights(
        sourceAirport,
        destAirport,
        departureTime,
        page = 0,
        limit = 10
      ) {
        // find flights using aggregation pipeline
        const docs = await this.aggregate([
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
                  departureTime: {
                    $lte: timestampGetEndOfDay(departureTime),
                  },
                },
              ],
            },
          },
          {
            $facet: {
              data: [
                {
                  $skip: page * limit,
                },
                {
                  $limit: limit,
                },
              ],
              metadata: [{ $count: "total" }, { $addFields: { page, limit } }],
            },
          },
        ]);

        // construct url
        const backendUrl = new URL(
          `${config.AIRTORONTO_BACKEND_URL}/api/flights/oneway`
        );

        // url params
        backendUrl.searchParams.append("sourceAirport", sourceAirport);
        backendUrl.searchParams.append("destAirport", destAirport);
        backendUrl.searchParams.append("departureDate", departureTime);

        // pagination links
        let links;
        if (docs[0].metadata[0] !== undefined)
          links = generatePaginationLinks(
            backendUrl.toString(),
            page,
            limit,
            docs[0].metadata[0].total
          );

        return {
          data: docs[0].data,
          metadata: {
            ...docs[0].metadata[0],
            count: docs[0].data.length,
          },
          links,
        };
      },
    },
  }
);

export default Flight;
