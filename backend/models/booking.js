import mongoose from "mongoose";
import { BookingSchema } from "../schemas/index.js";

export default mongoose.model("Booking", BookingSchema);
