import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-white/10 transition-default hover:border-neon/40 hover:shadow-[0_0_30px_rgba(0,243,255,0.08)]">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        {project.featured ? (
          <Badge className="absolute left-3 top-3" variant="neon">
            Featured
          </Badge>
        ) : null}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
        {project.status ? (
          <p className="text-xs font-mono text-neon/80">{project.status}</p>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-neon transition-default hover:text-gold"
        >
          View project <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
