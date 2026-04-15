import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <Card className="group h-full overflow-hidden border-white/10 transition-default hover:border-gold/40">
      <div className="relative aspect-[2/1] overflow-hidden">
        <img
          src={post.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent opacity-90" />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl group-hover:text-neon transition-default">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime} min read
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      </CardContent>
    </Card>
  );
}
