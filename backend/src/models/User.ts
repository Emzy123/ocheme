import mongoose, { Schema } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
