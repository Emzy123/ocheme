import mongoose, { Schema } from "mongoose";

export interface IHero {
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImage: string;
  updatedAt: Date;
}

const heroSchema = new Schema<IHero>(
  {
    headline: { type: String, required: true },
    subheadline: { type: String, required: true },
    primaryCtaText: { type: String, required: true },
    primaryCtaLink: { type: String, required: true },
    secondaryCtaText: { type: String, required: true },
    secondaryCtaLink: { type: String, required: true },
    heroImage: { type: String, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const Hero = mongoose.models.Hero || mongoose.model<IHero>("Hero", heroSchema);
