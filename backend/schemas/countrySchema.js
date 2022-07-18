import mongoose from "mongoose";
const { Schema } = mongoose;

const Country = new mongoose.Schema(
  {
    name: String,
    isoCode: String,
    dafifCode: String,
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
    },
  }
);

export default Country;
