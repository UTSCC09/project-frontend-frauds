import mongoose from "mongoose";
const { Schema } = mongoose;
import { generateSearch } from "../api/helpers/index.js";

const Route = new Schema(
  {
    airline: String,
    airlineId: String,
    sourceAirport: String,
    sourceAirportId: String,
    destAirport: String,
    destAirportId: String,
    codeshare: String,
    stops: String,
    equipment: {
      type: String,
      get: (v) => v.split(" "),
    },
  },
  {
    statics: {
      async paginate(page = 0, limit = 10) {
        const count = await this.estimatedDocumentCount({});
        const docs = await this.find({})
          .sort({ airlineId: 1 })
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

export default mongoose.model("Route", Route);
