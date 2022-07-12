import mongoose from "mongoose";
import { CountrySchema } from "../schemas/index.js";

export default mongoose.model("Country", CountrySchema);
