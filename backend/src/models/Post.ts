import mongoose, { Schema } from "mongoose";

export interface IPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  image: string;
  readTime: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: true },
    readTime: { type: Number, required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
