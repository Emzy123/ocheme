import mongoose, { Schema } from "mongoose";

export interface IAbout {
  biography: string;
  achievements: string[];
  skills: string[];
  mission: string;
  vision: string;
  updatedAt: Date;
}

const aboutSchema = new Schema<IAbout>(
  {
    biography: { type: String, required: true },
    achievements: [{ type: String }],
    skills: [{ type: String }],
    mission: { type: String, required: true },
    vision: { type: String, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const About = mongoose.models.About || mongoose.model<IAbout>("About", aboutSchema);
