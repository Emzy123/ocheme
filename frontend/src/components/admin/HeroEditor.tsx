import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHero } from "@/services/api";
import { putHero, uploadFile } from "@/services/adminApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function HeroEditor() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["hero"], queryFn: getHero });

  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [primaryCtaText, setPrimaryCtaText] = useState("");
  const [primaryCtaLink, setPrimaryCtaLink] = useState("");
  const [secondaryCtaText, setSecondaryCtaText] = useState("");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("");
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    if (data) {
      setHeadline(data.headline);
      setSubheadline(data.subheadline);
      setPrimaryCtaText(data.primaryCtaText);
      setPrimaryCtaLink(data.primaryCtaLink);
      setSecondaryCtaText(data.secondaryCtaText);
      setSecondaryCtaLink(data.secondaryCtaLink);
      setHeroImage(data.heroImage);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      putHero(token!, {
        headline,
        subheadline,
        primaryCtaText,
        primaryCtaLink,
        secondaryCtaText,
        secondaryCtaLink,
        heroImage,
      }),
    onSuccess: () => {
      toast.success("Hero section saved");
      qc.invalidateQueries({ queryKey: ["hero"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    try {
      const { url } = await uploadFile(token, file);
      setHeroImage(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  if (isLoading || !data) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subheadline">Subheadline</Label>
          <Textarea
            id="subheadline"
            rows={3}
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary CTA text</Label>
            <Input value={primaryCtaText} onChange={(e) => setPrimaryCtaText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA link</Label>
            <Input value={primaryCtaLink} onChange={(e) => setPrimaryCtaLink(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA text</Label>
            <Input value={secondaryCtaText} onChange={(e) => setSecondaryCtaText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA link</Label>
            <Input value={secondaryCtaLink} onChange={(e) => setSecondaryCtaLink(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Hero image URL</Label>
          <Input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} />
          <div className="flex items-center gap-4">
            <Input type="file" accept="image/*" onChange={onFile} className="max-w-xs cursor-pointer" />
            {heroImage ? (
              <img src={heroImage} alt="" className="h-20 w-16 rounded object-cover border border-white/10" />
            ) : null}
          </div>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save hero"}
        </Button>
      </CardContent>
    </Card>
  );
}
