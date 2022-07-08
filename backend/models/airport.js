import mongoose from "mongoose";
const { Schema } = mongoose;
import { generateSearch } from "../api/helpers/index.js";

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
      async search(query, fields, match, include, exclude, limit = 5) {
        const searchObj = generateSearch(
          query,
          fields,
          match,
          include,
          exclude
        );

        // no results
        if (!searchObj) return { data: [] };

        // return results
        return {
          data: await this.find(searchObj.query, searchObj.projection).limit(
            limit
          ),
        };
      },
    },
  }
);

export default mongoose.model("Airport", Airport);
