import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAbout } from "@/services/api";
import { putAbout } from "@/services/adminApi";
import { useAuth } from "@/context/AuthContext";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { toast } from "sonner";

export function AboutEditor() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["about"], queryFn: getAbout });

  const [biography, setBiography] = useState("");
  const [achievementsText, setAchievementsText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");

  useEffect(() => {
    if (data) {
      setBiography(data.biography);
      setAchievementsText(data.achievements.join("\n"));
      setSkillsText(data.skills.join(", "));
      setMission(data.mission);
      setVision(data.vision);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      putAbout(token!, {
        biography,
        achievements: achievementsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        mission,
        vision,
      }),
    onSuccess: () => {
      toast.success("About section saved");
      qc.invalidateQueries({ queryKey: ["about"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !data) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 max-w-3xl">
        <div className="space-y-2">
          <Label>Biography (rich text)</Label>
          <RichTextEditor value={biography} onChange={setBiography} />
        </div>
        <div className="space-y-2">
          <Label>Achievements (one per line)</Label>
          <Textarea
            rows={6}
            value={achievementsText}
            onChange={(e) => setAchievementsText(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Skills (comma-separated)</Label>
          <Input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Mission</Label>
          <Textarea rows={3} value={mission} onChange={(e) => setMission(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Vision</Label>
          <Textarea rows={3} value={vision} onChange={(e) => setVision(e.target.value)} />
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save about"}
        </Button>
      </CardContent>
    </Card>
  );
}
