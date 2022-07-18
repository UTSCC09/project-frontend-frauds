import mongoose from "mongoose";
const { Schema } = mongoose;
import { generateProjection } from "../api/helpers/index.js";

const Airport = new Schema(
  {
    airportId: String,
    name: String,
    city: String,
    country: String,
    iata: String,
    icao: String,
    latitude: String,
    longitude: String,
    altitude: String,
    timezone: String,
    dst: String,
    tzDatabaseTimeZone: String,
    type: String,
    source: String,
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

export default Airport;