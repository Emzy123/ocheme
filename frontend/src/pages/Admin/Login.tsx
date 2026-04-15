import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageMeta } from "@/components/seo/PageMeta";
import { login } from "@/services/adminApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login: setToken, token } = useAuth();
  const [email, setEmail] = useState("admin@emmanuelocheme.com");
  const [password, setPassword] = useState("");

  const mut = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      setToken(data.token);
      toast.success("Signed in");
      navigate("/admin", { replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (token) navigate("/admin", { replace: true });
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <PageMeta title="Admin Login" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-gold">Admin</CardTitle>
          <CardDescription>Sign in to manage site content. Change the default password after first login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              mut.mutate();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={mut.isPending}>
              {mut.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
