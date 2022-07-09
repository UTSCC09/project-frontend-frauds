import mongoose from "mongoose";
import { AirportSchema } from "../schemas/index.js";

export default mongoose.model("Airport", AirportSchema);
