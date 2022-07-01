const mongoose = require("mongoose");

const Country = new mongoose.Schema(
  {
    name: String,
    isoCode: String,
    dafifCode: String,
  },
  {
    statics: {
      async pagination(page = 0, limit = 10) {
        const count = await this.estimatedDocumentCount({});
        const docs = await this.find({})
          .sort({ name: 1 })
          .skip(page * limit)
          .limit(limit);

        return { count, docs };
      },
    },
  }
);

module.exports = mongoose.model("Country", Country);
