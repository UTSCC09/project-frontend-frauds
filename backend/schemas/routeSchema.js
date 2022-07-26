import mongoose from "mongoose";
const { Schema } = mongoose;
import { generateProjection } from "../api/helpers/index.js";
import { AirlineSchema, PlaneSchema, AirportSchema } from "./index.js";

const Route = new Schema(
  {
    routeId: String,
    airline: String,
    airlineId: String,
    sourceAirport: String,
    sourceAirportId: String,
    destAirport: String,
    destAirportId: String,
    codeshare: String,
    stops: String,
    equipment: String,
    equipmentList: [String],
    equipmentListData: [PlaneSchema],
    airlineData: [AirlineSchema],
    sourceAirportData: [AirportSchema],
    destAirportData: [AirportSchema],
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
      async search(query, include = [], exclude = [], limit = 10) {
        // no results
        if (!query) return { data: [] };

        // cannot project score field
        if (exclude.length && exclude.includes("score"))
          throw createError(400, "Cannot exclude score field from results");

        // conduct search
        const docs = await this.find(
          { $text: { $search: query } },
          {
            score: { $meta: "textScore" },
            ...generateProjection(include, exclude),
          }
        )
          .sort({ score: { $meta: "textScore" } })
          .limit(limit);

        // return results
        return { data: docs };
      },
    },
  }
);

export default Route;
