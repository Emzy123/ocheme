export interface HeroContent {
  _id: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImage: string;
  updatedAt: string;
}

export interface AboutContent {
  _id: string;
  biography: string;
  achievements: string[];
  skills: string[];
  mission: string;
  vision: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  readTime: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: { email: string; role: string };
}
