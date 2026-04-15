import mongoose, { Schema } from "mongoose";

export type MessageStatus = "read" | "unread";

export interface IMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["read", "unread"], default: "unread" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
