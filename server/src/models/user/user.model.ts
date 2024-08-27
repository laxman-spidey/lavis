import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: Schema.Types.String,
  lastname: Schema.Types.String,
  username: {
    type: Schema.Types.String,
    required: "Email is required",
    index: true,
  },
  password: {
    type: Schema.Types.String,
    // required:'Password is required'
  },
  role: {
    type: String,
    enum: ["patient", "admin", "doctor"],
  },
  lastLoggedIn: {
    type: Date,
  },
  session: {
    type: {
      token: String,
    },
  },
  socket: {
    type: Schema.Types.String,
  },
});

export const User = model("user", userSchema);
export type UserSchema = typeof User;
export default User;
