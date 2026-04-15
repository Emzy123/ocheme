import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Page views and engagement metrics can be wired here (e.g. Plausible, PostHog, or a custom counter).
          Coming soon.
        </p>
      </CardContent>
    </Card>
  );
}
