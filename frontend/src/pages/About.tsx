import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/seo/PageMeta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAbout } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function About() {
  const { data, isLoading, error } = useQuery({ queryKey: ["about"], queryFn: getAbout });

  return (
    <Layout>
      <PageMeta title="About" description="Biography, mission, and milestones — Emmanuel Ocheme." />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-neon" />
          </div>
        ) : error ? (
          <p className="text-center text-destructive">{(error as Error).message}</p>
        ) : data ? (
          <div className="space-y-12">
            <header>
              <h1 className="font-display text-4xl font-bold text-gold sm:text-5xl">About me</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Founder of Quantro Software Labs — building pathways for the next generation.
              </p>
            </header>
            <div
              className="prose prose-invert max-w-none text-muted-foreground prose-headings:font-display prose-headings:text-foreground"
              dangerouslySetInnerHTML={{ __html: data.biography }}
            />
            <Separator />
            <section>
              <h2 className="font-display text-2xl font-semibold text-gold">Achievements & milestones</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                {data.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl font-semibold text-gold">Skills & expertise</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.skills.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </section>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{data.mission}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{data.vision}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
