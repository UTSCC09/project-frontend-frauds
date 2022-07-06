import mongoose from "mongoose";
const { Schema } = mongoose;
import tokenize from "../utils/tokenize.js";

const Plane = new Schema(
  {
    name: String,
    iata: String,
    icao: String,
    passengerCapacity: Number,
    seats: [[]],
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
      async search(query, fields, limit = 5) {
        const tokens = tokenize(query);

        // regex's to conduct search
        const searches = tokens.flatMap((token) => {
          return fields.map((field) => {
            return { [field]: { $regex: `.*${token}.*`, $options: "i" } };
          });
        });

        // no searches to make
        if (!searches.length) return { data: [] };

        // search db
        const docs = await this.find(
          { $or: searches },
          { name: 1, iata: 1 }
        ).limit(limit);

        // return results
        return { data: docs };
      },
    },
  }
);

export default mongoose.model("Plane", Plane);
