import mongoose from "mongoose";
import { FlightSchema } from "../schemas/index.js";

export default mongoose.model("Flight", FlightSchema);
