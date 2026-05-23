// src/sections/workSpaceSection/AlgorithmsWorkspaceSection.tsx

import { Canvas } from "@react-three/fiber";

import { SortingScene } from "../../features/algorithms/sorting/scene/SortingScene";
import type { DataElement } from "../../features/algorithms/sorting/components/SortingBars";
import { isSortingAlgorithmId } from "../../features/algorithms/sorting/runtime/useSortingRunner";

import { PlaybackControls } from "../../shared/components/ui/PlaybackControls";

import {
  getItemsByCategory,
  getItemsByDomain,
  getVisibleCategoriesByDomain,
  isCatalogItemId,
} from "../../shared/constants/catalogSelectors";

import { useAlgoRuntimeStore } from "../../store/useAlgoRuntimeStore";
import { useCatalogSelectionStore } from "../../store/useCatalogSelectionStore";

const SORTING_BAR_COUNT = 24;

const createShuffledArray = (size: number): number[] => {
  const values = Array.from({ length: size }, (_, index) => index + 1);

  for (let index = values.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [values[index], values[randomIndex]] = [
      values[randomIndex],
      values[index],
    ];
  }

  return values;
};

const SORTING_INITIAL_ARRAY = createShuffledArray(SORTING_BAR_COUNT);

const sortingData: DataElement[] = SORTING_INITIAL_ARRAY.map((value) => ({
  value,
}));

export const AlgorithmsWorkspaceSection = () => {
  const selectedItemId = useCatalogSelectionStore(
    (state) => state.selectedItemId,
  );

  const selectItem = useCatalogSelectionStore((state) => state.selectItem);
  const resetRuntime = useAlgoRuntimeStore((state) => state.reset);
  const algorithmItems = getItemsByDomain("algorithms");
  const availableCategories = getVisibleCategoriesByDomain("algorithms");
  const selectedItem = algorithmItems.find(
    (item) => item.id === selectedItemId,
  );

  const hasAvailableItems = algorithmItems.length > 0;

  const handleSelectAlgorithm = (itemId: string) => {
  
    if (!isCatalogItemId(itemId)) return;

    resetRuntime();
    selectItem(itemId);
  };

  const renderSelectedAlgorithmScene = () => {
    if (!selectedItem) {
      return (
        <div className="flex h-full items-center justify-center px-6 text-center">
          <p className="text-3xl font-black uppercase tracking-tighter text-text-primary/10 sm:text-4xl md:text-6xl">
            Selecciona un algoritmo
          </p>
        </div>
      );
    }

    if (isSortingAlgorithmId(selectedItem.id)) {
      return (
        <div className="flex h-full w-full flex-col">
          <div className="border-b border-algo-border bg-surface/80 p-3 sm:p-4">
            <PlaybackControls />
          </div>

          <div className="min-h-0 flex-1">
            <Canvas className="h-full w-full">
              <SortingScene
                algorithmId={selectedItem.id}
                data={sortingData}
                rawArray={SORTING_INITIAL_ARRAY}
              />
            </Canvas>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <div>
          <p className="text-3xl font-black uppercase tracking-tighter text-text-primary/10 sm:text-4xl md:text-6xl">
            {selectedItem.name}
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-secondary">
            Este algoritmo está en el catálogo, pero todavía no tiene escena 3D
            conectada.
          </p>
        </div>
      </div>
    );
  };

  return (
    <section id="workspace" className="w-full px-3 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-algo-border bg-surface p-4 shadow-2xl sm:rounded-[2.5rem] sm:p-8">
        <div className="mb-6 border-b border-algo-border pb-6 sm:mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-data-comparing">
            Algorithms Workspace
          </p>

          <h2 className="mt-2 text-2xl font-black text-text-primary sm:text-3xl">
            Algoritmos
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Selecciona un algoritmo para visualizar su ejecución paso a paso.
          </p>
        </div>

        <div className="max-w-xl">
          <label
            htmlFor="algorithm-select"
            className="mb-3 block text-sm font-bold text-data-comparing"
          >
            Tipo de algoritmo
          </label>

          <div className="relative rounded-2xl border border-data-comparing bg-data-comparing/10 p-1 shadow-lg">
            <select
              id="algorithm-select"
              value={selectedItem?.id ?? ""}
              onChange={(event) => handleSelectAlgorithm(event.target.value)}
              disabled={!hasAvailableItems}
              className={[
                "w-full appearance-none rounded-xl border border-data-comparing/60",
                "bg-data-background px-5 py-4 pr-12 text-sm font-bold text-text-primary",
                "outline-none transition",
                "focus:border-data-comparing focus:ring-2 focus:ring-data-comparing/30",
                hasAvailableItems
                  ? "cursor-pointer hover:bg-surface-hover"
                  : "cursor-not-allowed opacity-60",
              ].join(" ")}
            >
              <option
                value=""
                disabled
                className="bg-data-background text-text-secondary"
              >
                {hasAvailableItems
                  ? "Selecciona un algoritmo"
                  : "Aún no hay algoritmos implementados"}
              </option>

              {availableCategories.map((category) => {
                const categoryItems = getItemsByCategory(category.id);

                return (
                  <optgroup
                    key={category.id}
                    label={category.title}
                    className="bg-data-background text-data-comparing"
                  >
                    {categoryItems.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="bg-data-background text-text-primary"
                      >
                        {item.name}
                        {item.complexity ? ` · ${item.complexity}` : ""}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>

            <span className="pointer-events-none absolute right-6 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xl bg-data-comparing/15 text-data-comparing">
              ▼
            </span>
          </div>

          {selectedItem && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-data-comparing/60 bg-data-background/70 shadow-lg">
              <div className="h-1 w-full bg-data-comparing" />

              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-widest text-data-comparing">
                      Algoritmo seleccionado
                    </p>

                    <h3 className="font-bold text-text-primary">
                      {selectedItem.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {selectedItem.description}
                    </p>
                  </div>

                  {selectedItem.complexity && (
                    <span className="rounded-full border border-data-comparing/60 bg-data-comparing/10 px-3 py-1 font-mono text-[10px] font-bold text-data-comparing">
                      {selectedItem.complexity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {!hasAvailableItems && (
            <div className="mt-4 rounded-2xl border border-algo-border bg-data-background/60 p-4 sm:p-5">
              <h3 className="font-bold text-text-primary">
                Sin algoritmos disponibles todavía
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Este espacio ya está preparado. Cuando agregues algoritmos al
                catálogo, aparecerán automáticamente en este selector.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 h-[520px] overflow-hidden rounded-[1.5rem] border border-algo-border bg-data-background sm:h-[560px] sm:rounded-[2rem] md:aspect-video md:h-auto">
          {renderSelectedAlgorithmScene()}
        </div>
      </div>
    </section>
  );
};