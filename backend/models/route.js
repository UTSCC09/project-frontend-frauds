import mongoose from "mongoose";
import { RouteSchema } from "../schemas/index.js";

export default mongoose.model("Route", RouteSchema);
