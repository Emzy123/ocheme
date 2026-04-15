import type { AboutContent, HeroContent, Post, Project, ContactMessage, LoginResponse } from "@/types";

const base = () => import.meta.env.VITE_API_URL ?? "";

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseJson<T>(res: Response, opts?: { skipAuthEvent?: boolean }): Promise<T> {
  if (res.status === 204) return undefined as T;
  if (res.status === 401 && !opts?.skipAuthEvent) {
    window.dispatchEvent(new Event("admin:unauthorized"));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: string }).error || res.statusText;
    throw new Error(msg || "Request failed");
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${base()}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJson<LoginResponse>(res, { skipAuthEvent: true });
}

export async function putHero(token: string, data: Partial<HeroContent>): Promise<HeroContent> {
  const res = await fetch(`${base()}/api/admin/hero`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return parseJson<HeroContent>(res);
}

export async function putAbout(token: string, data: Partial<AboutContent>): Promise<AboutContent> {
  const res = await fetch(`${base()}/api/admin/about`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return parseJson<AboutContent>(res);
}

export async function createProject(token: string, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${base()}/api/admin/projects`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return parseJson<Project>(res);
}

export async function updateProject(
  token: string,
  id: string,
  data: Partial<Project>
): Promise<Project> {
  const res = await fetch(`${base()}/api/admin/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return parseJson<Project>(res);
}

export async function deleteProject(token: string, id: string): Promise<void> {
  const res = await fetch(`${base()}/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  await parseJson(res);
}

export async function reorderProjects(
  token: string,
  orders: { id: string; order: number }[]
): Promise<Project[]> {
  const res = await fetch(`${base()}/api/admin/projects/reorder`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ orders }),
  });
  return parseJson<Project[]>(res);
}

export async function listAdminPosts(token: string): Promise<Post[]> {
  const res = await fetch(`${base()}/api/admin/posts`, {
    headers: authHeaders(token),
  });
  return parseJson<Post[]>(res);
}

export async function createPost(token: string, data: Partial<Post>): Promise<Post> {
  const res = await fetch(`${base()}/api/admin/posts`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return parseJson<Post>(res);
}

export async function updatePost(token: string, id: string, data: Partial<Post>): Promise<Post> {
  const res = await fetch(`${base()}/api/admin/posts/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return parseJson<Post>(res);
}

export async function deletePost(token: string, id: string): Promise<void> {
  const res = await fetch(`${base()}/api/admin/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  await parseJson(res);
}

export async function listMessages(token: string): Promise<ContactMessage[]> {
  const res = await fetch(`${base()}/api/admin/messages`, {
    headers: authHeaders(token),
  });
  return parseJson<ContactMessage[]>(res);
}

export async function updateMessageStatus(
  token: string,
  id: string,
  status: "read" | "unread"
): Promise<ContactMessage> {
  const res = await fetch(`${base()}/api/admin/messages/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  return parseJson<ContactMessage>(res);
}

export async function deleteMessage(token: string, id: string): Promise<void> {
  const res = await fetch(`${base()}/api/admin/messages/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  await parseJson(res);
}

export async function uploadFile(token: string, file: File): Promise<{ url: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${base()}/api/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  return parseJson<{ url: string }>(res);
}
