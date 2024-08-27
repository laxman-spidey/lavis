import { Schema, model } from "mongoose";

interface IUser {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    role: string;
    lastLoggedIn: Date;
    session: {
        token: string;
    };
    socket: string;
}
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

export const User = model<IUser>("user", userSchema);
export type UserSchema = typeof User;
export default User;
