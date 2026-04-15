import type { Request, Response } from "express";
import { Hero } from "../models/Hero.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getHero(_req: Request, res: Response): Promise<void> {
  const doc = await Hero.findOne().lean();
  if (!doc) {
    throw new AppError("Hero content not found", 404);
  }
  res.json(doc);
}

export async function updateHero(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  const keys = [
    "headline",
    "subheadline",
    "primaryCtaText",
    "primaryCtaLink",
    "secondaryCtaText",
    "secondaryCtaLink",
    "heroImage",
  ] as const;
  const $set: Record<string, unknown> = {};
  for (const k of keys) {
    if (body[k] !== undefined) $set[k] = body[k];
  }
  const doc = await Hero.findOneAndUpdate({}, { $set }, { new: true, upsert: true, runValidators: true });
  res.json(doc);
}
