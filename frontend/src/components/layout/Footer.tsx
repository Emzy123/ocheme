import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const social = [
  { href: "https://twitter.com/EmmanuelOcheme", label: "Twitter", Icon: Twitter },
  { href: "https://linkedin.com/in/emmanuel-ocheme", label: "LinkedIn", Icon: Linkedin },
  { href: "https://github.com/emmanuel-ocheme", label: "GitHub", Icon: Github },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-black/40 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-gold">Building Technology That Creates Opportunities</p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {year} Emmanuel Ocheme. Built with React & TailwindCSS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-neon transition-default">
            Home
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-neon transition-default">
            About
          </Link>
          <Link to="/projects" className="text-muted-foreground hover:text-neon transition-default">
            Projects
          </Link>
          <Link to="/blog" className="text-muted-foreground hover:text-neon transition-default">
            Blog
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-neon transition-default">
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {social.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted-foreground transition-default hover:text-neon"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
