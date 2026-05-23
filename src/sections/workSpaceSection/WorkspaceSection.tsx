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
    <section id="workspace" className="w-full px-6 pb-32">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-algo-border bg-surface/70 p-10 text-center shadow-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-data-comparing">
          Workspace en espera
        </p>

        <h2 className="mt-3 text-3xl font-black text-text-primary">
          Elige un tipo de visualización
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
          Usa el menú flotante para seleccionar entre estructuras de datos o
          algoritmos. Después podrás elegir el elemento concreto dentro del
          workspace.
        </p>
      </div>
    </section>
  );
};