import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const sorted = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });
  const top = sorted.slice(0, 3);

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-gold">Featured work</h2>
            <p className="mt-2 text-muted-foreground">
              Flagship ventures and products shaping opportunity across Africa.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {top.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
