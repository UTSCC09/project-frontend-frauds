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

        try {
          if (await this.findOne({ email: email })) {
            throw createError(400, "email is already registered.");
          }
        } catch (e) {
          throw createError(500, e, "find email errror");
        }

        try {
          const doc = await this.create({
            email: email,
            name: name,
            role: role,
          });
        } catch (e) {
          throw createError(500, e, "Insertion error");
        }

        return doc;

      },
      async updateRole(email, newRole) {

        try{
          const userDoc  = await this.findOne({ email: email });
          if (!userDoc) {
            throw createError(400, "user missing from DB");
          }
        } catch (e) {
          throw createError(500, e, "database error");
        }
        userDoc.roles = newRole;

        try{
          await userDoc.save();
        } catch (e) {
          throw createError(500, e, "failed to save to DB");
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
