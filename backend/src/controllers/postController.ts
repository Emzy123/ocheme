import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { AppError } from "../middleware/errorHandler.js";
import { sanitizeHtml } from "../utils/sanitizeHtml.js";

export async function listPublishedPosts(_req: Request, res: Response): Promise<void> {
  const list = await Post.find({ published: true }).sort({ date: -1 }).lean();
  res.json(list);
}

export async function listAllPosts(_req: Request, res: Response): Promise<void> {
  const list = await Post.find().sort({ date: -1 }).lean();
  res.json(list);
}

export async function getPostBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const doc = await Post.findOne({ slug, published: true }).lean();
  if (!doc) {
    throw new AppError("Post not found", 404);
  }
  res.json(doc);
}

export async function createPost(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  const content =
    typeof body.content === "string" ? sanitizeHtml(body.content) : "";
  const doc = await Post.create({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content,
    author: body.author,
    date: body.date ? new Date(body.date as string) : new Date(),
    image: body.image,
    readTime: Number(body.readTime) || 5,
    published: body.published !== undefined ? Boolean(body.published) : true,
  });
  res.status(201).json(doc);
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid id", 400);
  }
  const body = req.body as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.slug !== undefined) update.slug = body.slug;
  if (body.excerpt !== undefined) update.excerpt = body.excerpt;
  if (body.content !== undefined) update.content = sanitizeHtml(String(body.content));
  if (body.author !== undefined) update.author = body.author;
  if (body.date !== undefined) update.date = new Date(body.date as string);
  if (body.image !== undefined) update.image = body.image;
  if (body.readTime !== undefined) update.readTime = Number(body.readTime);
  if (body.published !== undefined) update.published = Boolean(body.published);

  const doc = await Post.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
  if (!doc) {
    throw new AppError("Post not found", 404);
  }
  res.json(doc);
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid id", 400);
  }
  const result = await Post.findByIdAndDelete(id);
  if (!result) {
    throw new AppError("Post not found", 404);
  }
  res.status(204).send();
}
