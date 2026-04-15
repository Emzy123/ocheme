import type { AboutContent, HeroContent, Post, Project } from "@/types";

const base = () => import.meta.env.VITE_API_URL ?? "";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: string }).error || res.statusText;
    throw new Error(msg || "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function getHero(): Promise<HeroContent> {
  const res = await fetch(`${base()}/api/hero`);
  return parseJson<HeroContent>(res);
}

export async function getAbout(): Promise<AboutContent> {
  const res = await fetch(`${base()}/api/about`);
  return parseJson<AboutContent>(res);
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${base()}/api/projects`);
  return parseJson<Project[]>(res);
}

export async function getProject(slug: string): Promise<Project> {
  const res = await fetch(`${base()}/api/projects/${encodeURIComponent(slug)}`);
  return parseJson<Project>(res);
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${base()}/api/posts`);
  return parseJson<Post[]>(res);
}

export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`${base()}/api/posts/${encodeURIComponent(slug)}`);
  return parseJson<Post>(res);
}

export async function submitContact(body: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ id: string; message: string }> {
  const res = await fetch(`${base()}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}
