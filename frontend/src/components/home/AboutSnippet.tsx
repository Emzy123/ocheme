import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutSnippet({ html }: { html: string }) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-2xl">About me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="prose prose-invert max-w-none text-muted-foreground prose-p:leading-relaxed first:prose-p:mt-0"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <Button variant="outline" asChild>
              <Link to="/about">Read full story</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
