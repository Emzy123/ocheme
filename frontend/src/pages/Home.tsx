import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageMeta } from "@/components/seo/PageMeta";
import { HeroSection } from "@/components/home/Hero";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { TechStrip } from "@/components/home/TechStrip";
import { getAbout, getHero, getProjects } from "@/services/api";
import { firstParagraphHtml } from "@/lib/html";
import { Loader2 } from "lucide-react";

export default function Home() {
  const heroQ = useQuery({ queryKey: ["hero"], queryFn: getHero });
  const aboutQ = useQuery({ queryKey: ["about"], queryFn: getAbout });
  const projectsQ = useQuery({ queryKey: ["projects"], queryFn: getProjects });

  const loading = heroQ.isLoading || aboutQ.isLoading || projectsQ.isLoading;
  const error = heroQ.error || aboutQ.error || projectsQ.error;

  return (
    <Layout>
      <PageMeta
        title="Emmanuel Ocheme | Quantro Software Labs"
        description="Building technology that creates opportunities — AI, Web3, and SaaS for students and young Africans."
      />
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-neon" aria-hidden />
        </div>
      ) : error ? (
        <div className="mx-auto max-w-lg px-4 py-24 text-center text-destructive">
          {(error as Error).message || "Failed to load content"}
        </div>
      ) : heroQ.data && aboutQ.data && projectsQ.data ? (
        <>
          <HeroSection data={heroQ.data} />
          <AboutSnippet html={firstParagraphHtml(aboutQ.data.biography)} />
          <FeaturedProjects projects={projectsQ.data} />
          <TechStrip />
        </>
      ) : null}
    </Layout>
  );
}
