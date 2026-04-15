export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-neon/10" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,243,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-neon/5 blur-3xl" />
    </div>
  );
}
