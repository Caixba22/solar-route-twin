// src/layouts/AppLayout.tsx

import type { ReactNode } from "react";

import { HeaderSection } from "../sections/headerSection/HeaderSection";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-dvh w-full bg-data-background text-text-primary antialiased">
      <HeaderSection />

      <main className="relative w-full bg-data-background">
        {children}
      </main>
    </div>
  );
};