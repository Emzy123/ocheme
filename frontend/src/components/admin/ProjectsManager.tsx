import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/services/api";
import {
  createProject,
  deleteProject,
  reorderProjects,
  updateProject,
  uploadFile,
} from "@/services/adminApi";
import { useAuth } from "@/context/AuthContext";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/slugify";
import type { Project } from "@/types";
import { toast } from "sonner";

function SortableRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-3"
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground hover:text-neon"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground truncate">{project.title}</p>
        <p className="text-xs text-muted-foreground font-mono">{project.slug}</p>
      </div>
      {project.featured ? <Badge variant="neon">Featured</Badge> : null}
      <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(project)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive"
        onClick={() => onDelete(project)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

const emptyForm = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  technologies: "",
  image: "",
  ctaLink: "",
  featured: false,
  status: "",
};

export function ProjectsManager() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["projects"], queryFn: getProjects });

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reorderMut = useMutation({
    mutationFn: (orders: { id: string; order: number }[]) => reorderProjects(token!, orders),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Order updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        technologies: form.technologies,
        image: form.image,
        ctaLink: form.ctaLink,
        featured: form.featured,
        status: form.status || undefined,
      };
      if (editing) {
        return updateProject(token!, editing._id, payload);
      }
      return createProject(token!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success(editing ? "Project updated" : "Project created");
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteProject(token!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((p) => p._id === active.id);
    const newIndex = sorted.findIndex((p) => p._id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(sorted, oldIndex, newIndex);
    const orders = next.map((p, i) => ({ id: p._id, order: i }));
    reorderMut.mutate(orders);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      technologies: p.technologies.join(", "),
      image: p.image,
      ctaLink: p.ctaLink,
      featured: p.featured,
      status: p.status ?? "",
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
        <CardTitle>Projects</CardTitle>
        <Button type="button" size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Add project
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={sorted.map((p) => p._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sorted.map((p) => (
                  <SortableRow
                    key={p._id}
                    project={p}
                    onEdit={openEdit}
                    onDelete={(proj) => {
                      if (confirm(`Delete "${proj.title}"?`)) delMut.mutate(proj._id);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
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
                <Label>Short description</Label>
                <Textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Full description</Label>
                <RichTextEditor
                  value={form.fullDescription}
                  onChange={(html) => setForm((f) => ({ ...f, fullDescription: html }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={form.technologies}
                  onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                />
                <Input type="file" accept="image/*" onChange={onImageFile} className="cursor-pointer" />
              </div>
              <div className="space-y-2">
                <Label>CTA link</Label>
                <Input
                  value={form.ctaLink}
                  onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status (optional)</Label>
                <Input
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Featured
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
