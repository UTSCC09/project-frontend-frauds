import mongoose from "mongoose";
const { Schema } = mongoose;

const User = new Schema(
  {
    email: { type: String, unique: true },
    name: String,
    role: [String],
    picture: String,
  },
  {
    statics: {
      async insertUser(email, name, role, picture) {
        // await this.findOne
        if (!email) return [];

        if (await this.findOne({ email: email })) {
          throw createError(400, "email is already registered.");
        }

        await this.create({
          email: email,
          name: name,
          role: role,
          picture: picture,
        });

        const user = await this.findOne({ email: email });

        return user;
      },
      async findUser(email) {
        const user = await this.findOne({ email: email });

        return user;
      },
    },
  }
);

export default User;
