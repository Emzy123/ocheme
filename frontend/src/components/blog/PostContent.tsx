import type { Post } from "@/types";

export function PostContent({ post }: { post: Post }) {
  return (
    <article className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-neon prose-headings:text-gold">
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
