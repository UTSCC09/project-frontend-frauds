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
      async search(query, match, include, exclude, limit = 10) {
        // no results
        if (!query) return { data: [] };

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

export default mongoose.model("Route", Route);
