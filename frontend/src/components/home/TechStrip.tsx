const tech: { label: string; slug: string; color: string }[] = [
  { label: "React", slug: "react", color: "61DAFB" },
  { label: "Node.js", slug: "nodedotjs", color: "339933" },
  { label: "MongoDB", slug: "mongodb", color: "47A248" },
  { label: "Web3.js", slug: "web3dotjs", color: "F16822" },
  { label: "Python", slug: "python", color: "3776AB" },
  { label: "Tailwind", slug: "tailwindcss", color: "06B6D4" },
  { label: "Supabase", slug: "supabase", color: "3ECF8E" },
  { label: "Solidity", slug: "solidity", color: "363636" },
];

export function TechStrip() {
  return (
    <section className="border-y border-white/10 bg-black/30 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Stack & tools
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {tech.map((t) => (
            <div key={t.slug} className="flex flex-col items-center gap-2">
              <img
                src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
                alt=""
                className="h-8 w-8 opacity-80 hover:opacity-100 transition-default"
                width={32}
                height={32}
              />
              <span className="font-mono text-xs text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
