import type { Request, Response } from "express";
import { About } from "../models/About.js";
import { AppError } from "../middleware/errorHandler.js";
import { sanitizeHtml } from "../utils/sanitizeHtml.js";

export async function getAbout(_req: Request, res: Response): Promise<void> {
  const doc = await About.findOne().lean();
  if (!doc) {
    throw new AppError("About content not found", 404);
  }
  res.json(doc);
}

export async function updateAbout(req: Request, res: Response): Promise<void> {
  const body = req.body as {
    biography?: string;
    achievements?: string[];
    skills?: string[];
    mission?: string;
    vision?: string;
  };
  const $set: Record<string, unknown> = {};
  if (body.biography != null) $set.biography = sanitizeHtml(body.biography);
  if (body.achievements != null) $set.achievements = body.achievements;
  if (body.skills != null) $set.skills = body.skills;
  if (body.mission != null) $set.mission = body.mission;
  if (body.vision != null) $set.vision = body.vision;
  const doc = await About.findOneAndUpdate({}, { $set }, { new: true, upsert: true, runValidators: true });
  res.json(doc);
}
