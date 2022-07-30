import mongoose from "mongoose";
import { UserSchema } from "../schemas/index.js";

export default mongoose.model("User", UserSchema);
