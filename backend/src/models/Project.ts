import mongoose, { Schema } from "mongoose";

export interface IProject {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  image: string;
  ctaLink: string;
  featured: boolean;
  order: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    technologies: [{ type: String }],
    image: { type: String, required: true },
    ctaLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1 });

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
