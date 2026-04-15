import type { Request, Response } from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import { Message } from "../models/Message.js";
import { AppError } from "../middleware/errorHandler.js";

export const contactValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail(),
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("subject").optional().trim(),
];

export async function submitContact(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { name, email, subject, message } = req.body as {
    name: string;
    email: string;
    subject?: string;
    message: string;
  };
  const doc = await Message.create({
    name,
    email,
    subject,
    message,
    status: "unread",
  });
  res.status(201).json({ id: doc._id, message: "Message received" });
}

export async function listMessages(_req: Request, res: Response): Promise<void> {
  const list = await Message.find().sort({ createdAt: -1 }).lean();
  res.json(list);
}

export async function updateMessage(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid id", 400);
  }
  const { status } = req.body as { status?: "read" | "unread" };
  if (!status || !["read", "unread"].includes(status)) {
    throw new AppError("status must be read or unread", 400);
  }
  const doc = await Message.findByIdAndUpdate(id, { $set: { status } }, { new: true });
  if (!doc) {
    throw new AppError("Message not found", 404);
  }
  res.json(doc);
}

export async function deleteMessage(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid id", 400);
  }
  const result = await Message.findByIdAndDelete(id);
  if (!result) {
    throw new AppError("Message not found", 404);
  }
  res.status(204).send();
}
