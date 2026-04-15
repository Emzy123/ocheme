import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppError("Invalid credentials", 401);
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("Server misconfiguration", 500);
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const signOptions: SignOptions = { expiresIn };
  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    secret,
    signOptions
  );
  res.json({ token, user: { email: user.email, role: user.role } });
}
