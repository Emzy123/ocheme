import type { ReactNode } from "react";
import { Background } from "./Background";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Background />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
