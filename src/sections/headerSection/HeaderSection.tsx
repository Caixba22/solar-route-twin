// src/sections/headerSection/HeaderSection.tsx
export const HeaderSection = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-algo-border bg-data-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="algo-glow flex h-9 w-9 items-center justify-center rounded-2xl bg-data-active text-text-primary shadow-lg">
          <span className="font-black tracking-tighter">V</span>
        </div>

        <span className="text-xl font-black uppercase tracking-tighter text-text-primary">
          Vertex
          <span className="text-algo-accent">Nodes</span>
        </span>
      </div>

      <nav className="flex items-center gap-6">   

        <div className="h-5 w-px bg-algo-border" />

        <span className="rounded-full border border-algo-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
          v1.0
        </span>
      </nav>
    </header>
  );
};