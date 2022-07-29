import mongoose from "mongoose";
import createError from "http-errors";
const { Schema } = mongoose;

const User = new Schema(
  {
    email: { type: String, unique: true },
    firstName: String,
    middleName: String,
    lastName: String,
    role: [String],
  },
  {
    statics: {
      async insertUser(email, name, role) {

        console.log(email, name, role);
        const doc = await this.create({
          email: email,
          firstName: name.firstName,
          middleName: name.middleName,
          lastName: name.lastName,
          role: role,
        });

        return doc;

      },
      async updateRole(email, newRole) {
        const userDoc  = await this.findOneAndUpdate({ email: email }, {role:newRole});
        if (!userDoc) {
          throw createError(400, "user missing from DB");
        }

        return userDoc;

      },
      async findUser(email) {
        const user = await this.findOne({ email: email });

        return user;
      },
    },
  }
);

export default User;
