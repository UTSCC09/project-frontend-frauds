import mongoose from "mongoose";
const { Schema } = mongoose;

const User = new Schema(
  {
    email: { type: String, unique: true },
    name: {firstname: String, middlename: String, lastname: String},
    roles: [String],
  },
  {
    statics: {
      async insertUser(email, name, role) {

        if (await this.findOne({ email: email })) {
          return {};
        }

        console.log(email, name, role);
        const doc = await this.create({
          email: email,
          name: name,
          role: role,
        });
        return doc;

      },
      async updateRole(email, newRole) {

        const userDoc  = await this.findOne({ email: email });
        if (!userDoc) {
          throw createError(400, "user missing from DB");
        }
        userDoc.roles = newRole;

        await userDoc.save();

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
