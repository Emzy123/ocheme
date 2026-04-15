import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/seo/PageMeta";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getProjects } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function Projects() {
  const { data, isLoading, error } = useQuery({ queryKey: ["projects"], queryFn: getProjects });

  const sorted = data
    ? [...data].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.order - b.order;
      })
    : [];

  return (
    <Layout>
      <PageMeta title="Projects" description="Portfolio — Quantro Software Labs and more." />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <header className="mb-12 max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-gold sm:text-5xl">Projects</h1>
          <p className="mt-4 text-muted-foreground">
            From AI-powered education to Web3 infrastructure — solutions designed for real impact.
          </p>
        </header>
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-neon" />
          </div>
        ) : error ? (
          <p className="text-destructive">{(error as Error).message}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {sorted.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
