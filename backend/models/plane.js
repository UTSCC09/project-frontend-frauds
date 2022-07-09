import mongoose from "mongoose";
import { PlaneSchema } from "../schemas/index.js";

export default mongoose.model("Plane", PlaneSchema);
