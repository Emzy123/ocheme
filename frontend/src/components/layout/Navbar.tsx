import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-sm font-medium transition-default hover:text-neon",
    isActive ? "text-neon" : "text-muted-foreground"
  );

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-gold">
          Emmanuel Ocheme
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/admin/login">Admin</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[280px] flex-col gap-4">
              <nav className="mt-8 flex flex-col gap-4" aria-label="Mobile">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="text-lg text-foreground hover:text-neon"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/admin/login"
                  className="text-lg text-gold hover:text-neon"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
