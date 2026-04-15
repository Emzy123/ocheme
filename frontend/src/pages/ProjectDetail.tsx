import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/seo/PageMeta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProject(slug!),
    enabled: Boolean(slug),
  });

  return (
    <Layout>
      <PageMeta title={data?.title ?? "Project"} description={data?.shortDescription} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Button variant="ghost" asChild className="mb-8 gap-2 text-muted-foreground">
          <Link to="/projects">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
        </Button>
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-neon" />
          </div>
        ) : error ? (
          <p className="text-destructive">{(error as Error).message}</p>
        ) : data ? (
          <article>
            <div className="relative mb-8 aspect-video overflow-hidden rounded-xl border border-white/10">
              <img src={data.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {data.featured ? <Badge variant="neon">Featured</Badge> : null}
              {data.status ? (
                <Badge variant="outline" className="font-mono text-xs">
                  {data.status}
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold text-gold">{data.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{data.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {data.technologies.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <div
              className="prose prose-invert mt-10 max-w-none prose-headings:font-display prose-a:text-neon"
              dangerouslySetInnerHTML={{ __html: data.fullDescription }}
            />
            {data.ctaLink ? (
              <div className="mt-10">
                {data.ctaLink.startsWith("http") ? (
                  <Button asChild>
                    <a href={data.ctaLink} target="_blank" rel="noreferrer">
                      Open link →
                    </a>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to={data.ctaLink}>Continue →</Link>
                  </Button>
                )}
              </div>
            ) : null}
          </article>
        ) : null}
      </div>
    </Layout>
  );
}
