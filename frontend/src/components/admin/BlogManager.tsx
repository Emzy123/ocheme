import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPost, deletePost, listAdminPosts, updatePost, uploadFile } from "@/services/adminApi";
import { useAuth } from "@/context/AuthContext";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/slugify";
import type { Post } from "@/types";
import { toast } from "sonner";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "Emmanuel Ocheme",
  date: "",
  image: "",
  readTime: 5,
  published: true,
};

export function BlogManager() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => listAdminPosts(token!),
    enabled: Boolean(token),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        image: form.image,
        readTime: Number(form.readTime) || 5,
        published: form.published,
      };
      if (editing) {
        return updatePost(token!, editing._id, payload);
      }
      return createPost(token!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      toast.success(editing ? "Post updated" : "Post created");
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deletePost(token!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
    setOpen(true);
  }

  function openEdit(p: Post) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: new Date(p.date).toISOString().slice(0, 10),
      image: p.image,
      readTime: p.readTime,
      published: p.published,
    });
    setOpen(true);
  }

  async function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    try {
      const { url } = await uploadFile(token, file);
      setForm((f) => ({ ...f, image: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Blog posts</CardTitle>
        <Button type="button" size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Add post
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          posts.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/30 p-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground font-mono">{p.slug}</p>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" onClick={() => openEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm(`Delete "${p.title}"?`)) delMut.mutate(p._id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const t = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title: t,
                      slug: editing ? f.slug : slugify(t),
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  value={form.content}
                  onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Read time (minutes)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.readTime}
                    onChange={(e) => setForm((f) => ({ ...f, readTime: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Featured image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                />
                <Input type="file" accept="image/*" onChange={onImageFile} className="cursor-pointer" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                Published
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
                {saveMut.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
