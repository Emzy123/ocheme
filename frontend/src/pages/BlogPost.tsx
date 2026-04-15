import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/seo/PageMeta";
import { PostContent } from "@/components/blog/PostContent";
import { Button } from "@/components/ui/button";
import { getPost } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPost(slug!),
    enabled: Boolean(slug),
  });

  const dateStr = data
    ? new Date(data.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Layout>
      <PageMeta title={data?.title ?? "Article"} description={data?.excerpt} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button variant="ghost" asChild className="mb-8 gap-2 text-muted-foreground">
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4" /> All posts
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
            <div className="relative mb-10 aspect-[2/1] overflow-hidden rounded-xl border border-white/10">
              <img src={data.image} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="text-sm text-neon">{data.author}</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-gold">{data.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {dateStr}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {data.readTime} min read
              </span>
            </div>
            <div className="mt-10">
              <PostContent post={data} />
            </div>
          </article>
        ) : null}
      </div>
    </Layout>
  );
}
