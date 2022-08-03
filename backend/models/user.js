import mongoose from "mongoose";
import { UserSchema } from "../schemas/index.js";
import { RegistrationQueue } from "../queue/index.js";

UserSchema.post("save", async (doc) => {
  await RegistrationQueue.add(doc);
});

export default mongoose.model("User", UserSchema);
