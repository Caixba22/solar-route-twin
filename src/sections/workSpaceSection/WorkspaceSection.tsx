// Ruta:
// src/sections/workSpaceSection/WorkspaceSection.tsx

import { useCatalogSelectionStore } from "../../store/useCatalogSelectionStore";
import { AlgorithmsWorkspaceSection } from "./AlgorithmsWorkspaceSection";
import { DataStructuresWorkspaceSection } from "./DataStructuresWorkspaceSection";

export const WorkspaceSection = () => {
  const activeDomainId = useCatalogSelectionStore(
    (state) => state.activeDomainId,
  );

  if (activeDomainId === "data-structures") {
    return <DataStructuresWorkspaceSection />;
  }

  if (activeDomainId === "algorithms") {
    return <AlgorithmsWorkspaceSection />;
  }

  return (
    <section id="workspace" className="w-full px-3 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-algo-border bg-surface p-6 text-center shadow-2xl sm:rounded-[2.5rem] sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-algo-border bg-data-background text-2xl text-algo-accent shadow-lg">
          ⬡
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-text-secondary">
          Workspace en espera
        </p>

        <h2 className="mt-3 text-2xl font-black text-text-primary sm:text-3xl">
          Selecciona un modo de visualización
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
          Usa el menú flotante para elegir entre estructuras de datos o
          algoritmos. Después podrás seleccionar el elemento específico dentro
          del workspace.
        </p>
      </div>
    </section>
  );
};