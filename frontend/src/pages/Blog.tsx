import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/seo/PageMeta";
import { PostCard } from "@/components/blog/PostCard";
import { getPosts } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function Blog() {
  const { data, isLoading, error } = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  return (
    <Layout>
      <PageMeta title="Blog" description="Insights on Web3, SaaS, and AI for African builders." />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <header className="mb-12 max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-gold sm:text-5xl">Insights</h1>
          <p className="mt-4 text-muted-foreground">
            Thoughts on technology, opportunity, and building for the next generation.
          </p>
        </header>
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-neon" />
          </div>
        ) : error ? (
          <p className="text-destructive">{(error as Error).message}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
