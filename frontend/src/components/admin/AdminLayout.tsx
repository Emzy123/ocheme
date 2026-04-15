import { Link } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/admin" className="flex items-center gap-2 font-display text-gold">
            <LayoutDashboard className="h-5 w-5" />
            Admin
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">View site</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="mr-1 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
