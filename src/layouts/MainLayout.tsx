import type { ReactNode } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}
