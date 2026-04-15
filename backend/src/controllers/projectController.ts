import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { AppError } from "../middleware/errorHandler.js";
import { sanitizeHtml } from "../utils/sanitizeHtml.js";

function parseTechnologies(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function listProjects(_req: Request, res: Response): Promise<void> {
  const list = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(list);
}

export async function getProjectBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const doc = await Project.findOne({ slug }).lean();
  if (!doc) {
    throw new AppError("Project not found", 404);
  }
  res.json(doc);
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  const technologies = parseTechnologies(body.technologies);
  const fullDescription =
    typeof body.fullDescription === "string" ? sanitizeHtml(body.fullDescription) : "";
  const maxOrder = await Project.findOne().sort({ order: -1 }).select("order").lean();
  const order = typeof body.order === "number" ? body.order : (maxOrder?.order ?? -1) + 1;
  const doc = await Project.create({
    title: body.title,
    slug: body.slug,
    shortDescription: body.shortDescription,
    fullDescription,
    technologies,
    image: body.image,
    ctaLink: body.ctaLink ?? "",
    featured: Boolean(body.featured),
    order,
    status: body.status as string | undefined,
  });
  res.status(201).json(doc);
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid id", 400);
  }
  const body = req.body as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.slug !== undefined) update.slug = body.slug;
  if (body.shortDescription !== undefined) update.shortDescription = body.shortDescription;
  if (body.fullDescription !== undefined) {
    update.fullDescription = sanitizeHtml(String(body.fullDescription));
  }
  if (body.technologies !== undefined) update.technologies = parseTechnologies(body.technologies);
  if (body.image !== undefined) update.image = body.image;
  if (body.ctaLink !== undefined) update.ctaLink = body.ctaLink;
  if (body.featured !== undefined) update.featured = Boolean(body.featured);
  if (body.order !== undefined) update.order = Number(body.order);
  if (body.status !== undefined) update.status = body.status;

  const doc = await Project.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
  if (!doc) {
    throw new AppError("Project not found", 404);
  }
  res.json(doc);
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid id", 400);
  }
  const result = await Project.findByIdAndDelete(id);
  if (!result) {
    throw new AppError("Project not found", 404);
  }
  res.status(204).send();
}

export async function reorderProjects(req: Request, res: Response): Promise<void> {
  const { orders } = req.body as { orders: { id: string; order: number }[] };
  if (!Array.isArray(orders)) {
    throw new AppError("orders must be an array", 400);
  }
  await Promise.all(
    orders.map((item) =>
      Project.findByIdAndUpdate(item.id, { $set: { order: item.order } })
    )
  );
  const list = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(list);
}
