import mongoose from "mongoose";
import { AirlineSchema } from "../schemas/index.js";

export default mongoose.model("Airline", AirlineSchema);
