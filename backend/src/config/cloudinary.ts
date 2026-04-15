import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary(): void {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!name || !key || !secret) {
    return;
  }
  cloudinary.config({
    cloud_name: name,
    api_key: key,
    api_secret: secret,
  });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export { cloudinary };
