import mongoose from "mongoose";
const { Schema } = mongoose;

const Country = new Schema({
  name: String,
  isoCode: String,
  dafifCode: String,
});

exports.module = mongoose.model("Country", Country);
