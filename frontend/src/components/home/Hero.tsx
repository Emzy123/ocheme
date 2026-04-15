import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { HeroContent } from "@/types";

export function HeroSection({ data }: { data: HeroContent }) {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div className="animate-fade-in space-y-6">
          <Badge variant="neon" className="w-fit">
            Building the future of African tech
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-gold via-white to-neon bg-clip-text text-transparent">
              {data.headline}
            </span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">{data.subheadline}</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link to={data.primaryCtaLink} className="inline-flex items-center gap-2">
                {data.primaryCtaText}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={data.secondaryCtaLink}>{data.secondaryCtaText}</Link>
            </Button>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/20 to-neon/10 shadow-[0_0_60px_rgba(212,175,55,0.15)]">
            <img
              src={data.heroImage}
              alt="Emmanuel Ocheme"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-neon/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
