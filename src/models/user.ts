import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  // Add other fields as needed, e.g., firstName, lastName, etc.
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  // Add other fields here
});

export const User = mongoose.model<IUser>('User', userSchema);
