import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", 401));
    return;
  }
  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new AppError("Server misconfiguration", 500));
    return;
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.admin = decoded;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
