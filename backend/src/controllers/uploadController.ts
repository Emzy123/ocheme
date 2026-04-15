import type { Request, Response } from "express";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import { AppError } from "../middleware/errorHandler.js";

export async function uploadImage(req: Request, res: Response): Promise<void> {
  if (!isCloudinaryConfigured()) {
    throw new AppError("Image upload is not configured", 503);
  }
  if (!req.file?.buffer) {
    throw new AppError("No file uploaded", 400);
  }
  const folder = process.env.CLOUDINARY_FOLDER || "emmanuel-portfolio";
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, callResult) => {
        if (err || !callResult) reject(err ?? new Error("Upload failed"));
        else resolve(callResult as { secure_url: string });
      }
    );
    stream.end(req.file!.buffer);
  });
  res.json({ url: result.secure_url });
}
